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
    public class ProductSubcategoryController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductSubcategoryRepository _productSubcategoryRepository;
        private ILogger<ProductSubcategoryRepository> _logger;

        public ProductSubcategoryController(IAccountRepository accountRepository, IProductSubcategoryRepository productSubcategoryRepository, ILogger<ProductSubcategoryRepository> logger)
        {
            _accountRepository = accountRepository;
            _productSubcategoryRepository = productSubcategoryRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductSubcategories")]
        public IActionResult Get()
        {
            try
            {
                var productSubcategories = _productSubcategoryRepository.GetProductSubcategories();
                var results = Mapper.Map<IEnumerable<ProductSubcategoryDto>>(productSubcategories);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductSubcategories: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductSubcategories({productSubcategoryId})")]
        public IActionResult Get([FromODataUri] int productSubcategoryId)
        {
            try
            {
                var productSubcategory = _productSubcategoryRepository.GetProductSubcategory(productSubcategoryId);
                if (productSubcategory == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductSubcategoryDto>(productSubcategory);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductSubcategories(productSubcategoryId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductSubcategories({productSubcategoryId})/ProductSubcategoryName")]
        [ODataRoute("ProductSubcategories({productSubcategoryId})/ProductSubcategoryName/$value")]
        public IActionResult GetProductSubcategoryProperty([FromODataUri] int productSubcategoryId, [FromODataUri] string property)
        {
            try
            {
                var productSubcategory = _productSubcategoryRepository.GetProductSubcategory(productSubcategoryId);
                if (productSubcategory == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productSubcategory.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productSubcategory = _productSubcategoryRepository.GetProductSubcategory(productSubcategoryId, propertyToGet);
                }

                if (!productSubcategory.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productSubcategory.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductSubcategoryProperty /ProductSubcategories(productSubcategoryId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductSubcategories")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductSubcategoryDto productSubcategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productSubcategory = Mapper.Map<ProductSubcategory>(productSubcategoryDto);
                if (_productSubcategoryRepository.ProductSubcategoryExists(productSubcategory))
                {
                    return StatusCode(500, "ProductSubcategory already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductSubcategory = _productSubcategoryRepository.CreateProductSubcategory(productSubcategory, profile.UserProfileId);

                if (createdProductSubcategory == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductSubcategoryToReturn = Mapper.Map<ProductSubcategoryDto>(createdProductSubcategory);
                return Created(createdProductSubcategoryToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductSubcategories: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductSubcategories({productSubcategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productSubcategoryId, [FromBody]ProductSubcategoryDto productSubcategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productSubcategoryRepository.ProductSubcategoryExists(productSubcategoryId))
                {
                    return NotFound();
                }

                var productSubcategory = Mapper.Map<ProductSubcategory>(productSubcategoryDto);
                if (_productSubcategoryRepository.ProductSubcategoryExists(productSubcategory))
                {
                    return StatusCode(500, "ProductSubcategory already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductSubcategory = _productSubcategoryRepository.UpdateProductSubcategory(productSubcategoryId, productSubcategory, profile.UserProfileId);

                if (updatedProductSubcategory == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductSubcategoryToReturn = Mapper.Map<ProductSubcategoryDto>(updatedProductSubcategory);
                return Created(updatedProductSubcategoryToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductSubcategories(productSubcategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductSubcategories({productSubcategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productSubcategoryId, [FromBody]Delta<ProductSubcategoryDto> productSubcategoryDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productSubcategoryRepository.ProductSubcategoryExists(productSubcategoryId))
                {
                    return NotFound();
                }

                var productSubcategoryToPatch = Mapper.Map<Delta<ProductSubcategory>>(productSubcategoryDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productSubcategoryToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productSubcategoryRepository.PartialUpdateProductSubcategory(productSubcategoryId, productSubcategoryToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductSubcategories(productSubcategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductSubcategories({productSubcategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productSubcategoryId)
        {
            try
            {
                if (!_productSubcategoryRepository.ProductSubcategoryExists(productSubcategoryId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productSubcategoryRepository.DeleteProductSubcategory(productSubcategoryId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductSubcategories(productSubcategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
