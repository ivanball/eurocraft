using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Eurocraft.API.Helpers;
using Eurocraft.Models;
using Eurocraft.DataAccessLayer.Services;
using Microsoft.Extensions.Logging;
using System;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Eurocraft.API.Controllers
{
    [Authorize]
    public class ProductTypeController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductTypeRepository _productTypeRepository;
        private ILogger<ProductTypeRepository> _logger;

        public ProductTypeController(IAccountRepository accountRepository, IProductTypeRepository productTypeRepository, ILogger<ProductTypeRepository> logger)
        {
            _accountRepository = accountRepository;
            _productTypeRepository = productTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductTypes")]
        public IActionResult Get()
        {
            try
            {
                var productTypes = _productTypeRepository.GetProductTypes();
                var results = Mapper.Map<IEnumerable<ProductTypeDto>>(productTypes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductTypes: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductTypes({productTypeId})")]
        public IActionResult Get([FromODataUri] int productTypeId)
        {
            try
            {
                var productType = _productTypeRepository.GetProductType(productTypeId);
                if (productType == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductTypeDto>(productType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductTypes(productTypeId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductTypes({productTypeId})/ProductTypeName")]
        [ODataRoute("ProductTypes({productTypeId})/ProductTypeName/$value")]
        public IActionResult GetProductTypeProperty([FromODataUri] int productTypeId, [FromODataUri] string property)
        {
            try
            {
                var productType = _productTypeRepository.GetProductType(productTypeId);
                if (productType == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productType.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productType = _productTypeRepository.GetProductType(productTypeId, propertyToGet);
                }

                if (!productType.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productType.GetValue(propertyToGet);
                if ((!isCollectionProperty) && (propertyValue == null))
                {
                    return NoContent();
                }

                if (getRawValue)
                {
                    return Ok(propertyValue.ToString());
                }
                else
                {
                    return Ok(propertyValue);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductTypeProperty /ProductTypes(productTypeId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductTypes")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductTypeDto productTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productType = Mapper.Map<ProductType>(productTypeDto);
                if (_productTypeRepository.ProductTypeExists(productType))
                {
                    return StatusCode(500, "ProductType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductType = _productTypeRepository.CreateProductType(productType, profile.UserProfileId);

                if (createdProductType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductTypeToReturn = Mapper.Map<ProductTypeDto>(createdProductType);
                return Created(createdProductTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductTypes: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductTypes({productTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productTypeId, [FromBody]ProductTypeDto productTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productTypeRepository.ProductTypeExists(productTypeId))
                {
                    return NotFound();
                }

                var productType = Mapper.Map<ProductType>(productTypeDto);
                if (_productTypeRepository.ProductTypeExists(productType))
                {
                    return StatusCode(500, "ProductType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductType = _productTypeRepository.UpdateProductType(productTypeId, productType, profile.UserProfileId);

                if (updatedProductType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductTypeToReturn = Mapper.Map<ProductTypeDto>(updatedProductType);
                return Created(updatedProductTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductTypes(productTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductTypes({productTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productTypeId, [FromBody]Delta<ProductTypeDto> productTypeDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productTypeRepository.ProductTypeExists(productTypeId))
                {
                    return NotFound();
                }

                var productTypeToPatch = Mapper.Map<Delta<ProductType>>(productTypeDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productTypeToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productTypeRepository.PartialUpdateProductType(productTypeId, productTypeToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductTypes(productTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductTypes({productTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productTypeId)
        {
            try
            {
                if (!_productTypeRepository.ProductTypeExists(productTypeId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productTypeRepository.DeleteProductType(productTypeId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductTypes(productTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
