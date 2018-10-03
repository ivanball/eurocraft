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
    public class ProductMaterialController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductMaterialRepository _productMaterialRepository;
        private ILogger<ProductMaterialRepository> _logger;

        public ProductMaterialController(IAccountRepository accountRepository, IProductMaterialRepository productMaterialRepository, ILogger<ProductMaterialRepository> logger)
        {
            _accountRepository = accountRepository;
            _productMaterialRepository = productMaterialRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductMaterials")]
        public IActionResult Get()
        {
            try
            {
                var productMaterials = _productMaterialRepository.GetProductMaterials();
                var results = Mapper.Map<IEnumerable<ProductMaterialDto>>(productMaterials);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductMaterials: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductMaterials({productMaterialId})")]
        public IActionResult Get([FromODataUri] int productMaterialId)
        {
            try
            {
                var productMaterial = _productMaterialRepository.GetProductMaterial(productMaterialId);
                if (productMaterial == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductMaterialDto>(productMaterial);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductMaterials(productMaterialId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductMaterials({productMaterialId})/ProductMaterialName")]
        [ODataRoute("ProductMaterials({productMaterialId})/ProductMaterialName/$value")]
        public IActionResult GetProductMaterialProperty([FromODataUri] int productMaterialId, [FromODataUri] string property)
        {
            try
            {
                var productMaterial = _productMaterialRepository.GetProductMaterial(productMaterialId);
                if (productMaterial == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productMaterial.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productMaterial = _productMaterialRepository.GetProductMaterial(productMaterialId, propertyToGet);
                }

                if (!productMaterial.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productMaterial.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductMaterialProperty /ProductMaterials(productMaterialId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductMaterials")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductMaterialDto productMaterialDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productMaterial = Mapper.Map<ProductMaterial>(productMaterialDto);
                if (_productMaterialRepository.ProductMaterialExists(productMaterial))
                {
                    return StatusCode(500, "ProductMaterial already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductMaterial = _productMaterialRepository.CreateProductMaterial(productMaterial, profile.UserProfileId);

                if (createdProductMaterial == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductMaterialToReturn = Mapper.Map<ProductMaterialDto>(createdProductMaterial);
                return Created(createdProductMaterialToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductMaterials: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductMaterials({productMaterialId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productMaterialId, [FromBody]ProductMaterialDto productMaterialDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productMaterialRepository.ProductMaterialExists(productMaterialId))
                {
                    return NotFound();
                }

                var productMaterial = Mapper.Map<ProductMaterial>(productMaterialDto);
                if (_productMaterialRepository.ProductMaterialExists(productMaterial))
                {
                    return StatusCode(500, "ProductMaterial already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductMaterial = _productMaterialRepository.UpdateProductMaterial(productMaterialId, productMaterial, profile.UserProfileId);

                if (updatedProductMaterial == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductMaterialToReturn = Mapper.Map<ProductMaterialDto>(updatedProductMaterial);
                return Created(updatedProductMaterialToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductMaterials(productMaterialId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductMaterials({productMaterialId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productMaterialId, [FromBody]Delta<ProductMaterialDto> productMaterialDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productMaterialRepository.ProductMaterialExists(productMaterialId))
                {
                    return NotFound();
                }

                var productMaterialToPatch = Mapper.Map<Delta<ProductMaterial>>(productMaterialDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productMaterialToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productMaterialRepository.PartialUpdateProductMaterial(productMaterialId, productMaterialToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductMaterials(productMaterialId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductMaterials({productMaterialId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productMaterialId)
        {
            try
            {
                if (!_productMaterialRepository.ProductMaterialExists(productMaterialId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productMaterialRepository.DeleteProductMaterial(productMaterialId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductMaterials(productMaterialId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
