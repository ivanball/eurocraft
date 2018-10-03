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
    public class ProductCategoryController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductCategoryRepository _productCategoryRepository;
        private ILogger<ProductCategoryRepository> _logger;

        public ProductCategoryController(IAccountRepository accountRepository, IProductCategoryRepository productCategoryRepository, ILogger<ProductCategoryRepository> logger)
        {
            _accountRepository = accountRepository;
            _productCategoryRepository = productCategoryRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductCategories")]
        public IActionResult Get()
        {
            try
            {
                var productCategories = _productCategoryRepository.GetProductCategories();
                var results = Mapper.Map<IEnumerable<ProductCategoryDto>>(productCategories);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductCategories: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductCategories({productCategoryId})")]
        public IActionResult Get([FromODataUri] int productCategoryId)
        {
            try
            {
                var productCategory = _productCategoryRepository.GetProductCategory(productCategoryId);
                if (productCategory == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductCategoryDto>(productCategory);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductCategories(productCategoryId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductCategories({productCategoryId})/ProductCategoryName")]
        [ODataRoute("ProductCategories({productCategoryId})/ProductCategoryName/$value")]
        public IActionResult GetProductCategoryProperty([FromODataUri] int productCategoryId, [FromODataUri] string property)
        {
            try
            {
                var productCategory = _productCategoryRepository.GetProductCategory(productCategoryId);
                if (productCategory == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productCategory.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productCategory = _productCategoryRepository.GetProductCategory(productCategoryId, propertyToGet);
                }

                if (!productCategory.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productCategory.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductCategoryProperty /ProductCategories(productCategoryId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductCategories")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductCategoryDto productCategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productCategory = Mapper.Map<ProductCategory>(productCategoryDto);
                if (_productCategoryRepository.ProductCategoryExists(productCategory))
                {
                    return StatusCode(500, "ProductCategory already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductCategory = _productCategoryRepository.CreateProductCategory(productCategory, profile.UserProfileId);

                if (createdProductCategory == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductCategoryToReturn = Mapper.Map<ProductCategoryDto>(createdProductCategory);
                return Created(createdProductCategoryToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductCategories: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductCategories({productCategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productCategoryId, [FromBody]ProductCategoryDto productCategoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productCategoryRepository.ProductCategoryExists(productCategoryId))
                {
                    return NotFound();
                }

                var productCategory = Mapper.Map<ProductCategory>(productCategoryDto);
                if (_productCategoryRepository.ProductCategoryExists(productCategory))
                {
                    return StatusCode(500, "ProductCategory already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductCategory = _productCategoryRepository.UpdateProductCategory(productCategoryId, productCategory, profile.UserProfileId);

                if (updatedProductCategory == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductCategoryToReturn = Mapper.Map<ProductCategoryDto>(updatedProductCategory);
                return Created(updatedProductCategoryToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductCategories(productCategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductCategories({productCategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productCategoryId, [FromBody]Delta<ProductCategoryDto> productCategoryDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productCategoryRepository.ProductCategoryExists(productCategoryId))
                {
                    return NotFound();
                }

                var productCategoryToPatch = Mapper.Map<Delta<ProductCategory>>(productCategoryDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productCategoryToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productCategoryRepository.PartialUpdateProductCategory(productCategoryId, productCategoryToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductCategories(productCategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductCategories({productCategoryId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productCategoryId)
        {
            try
            {
                if (!_productCategoryRepository.ProductCategoryExists(productCategoryId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productCategoryRepository.DeleteProductCategory(productCategoryId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductCategories(productCategoryId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
