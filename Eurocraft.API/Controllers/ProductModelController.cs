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
    public class ProductModelController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductModelRepository _productModelRepository;
        private ILogger<ProductModelRepository> _logger;

        public ProductModelController(IAccountRepository accountRepository, IProductModelRepository productModelRepository, ILogger<ProductModelRepository> logger)
        {
            _accountRepository = accountRepository;
            _productModelRepository = productModelRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductModels")]
        public IActionResult Get()
        {
            try
            {
                var productModels = _productModelRepository.GetProductModels();
                var results = Mapper.Map<IEnumerable<ProductModelDto>>(productModels);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductModels: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductModels({productModelId})")]
        public IActionResult Get([FromODataUri] int productModelId)
        {
            try
            {
                var productModel = _productModelRepository.GetProductModel(productModelId);
                if (productModel == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductModelDto>(productModel);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductModels(productModelId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductModels({productModelId})/ProductModelName")]
        [ODataRoute("ProductModels({productModelId})/ProductModelName/$value")]
        public IActionResult GetProductModelProperty([FromODataUri] int productModelId, [FromODataUri] string property)
        {
            try
            {
                var productModel = _productModelRepository.GetProductModel(productModelId);
                if (productModel == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productModel.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productModel = _productModelRepository.GetProductModel(productModelId, propertyToGet);
                }

                if (!productModel.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productModel.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductModelProperty /ProductModels(productModelId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductModels")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductModelDto productModelDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productModel = Mapper.Map<ProductModel>(productModelDto);
                if (_productModelRepository.ProductModelExists(productModel))
                {
                    return StatusCode(500, "ProductModel already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductModel = _productModelRepository.CreateProductModel(productModel, profile.UserProfileId);

                if (createdProductModel == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductModelToReturn = Mapper.Map<ProductModelDto>(createdProductModel);
                return Created(createdProductModelToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductModels: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductModels({productModelId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productModelId, [FromBody]ProductModelDto productModelDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productModelRepository.ProductModelExists(productModelId))
                {
                    return NotFound();
                }

                var productModel = Mapper.Map<ProductModel>(productModelDto);
                if (_productModelRepository.ProductModelExists(productModel))
                {
                    return StatusCode(500, "ProductModel already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductModel = _productModelRepository.UpdateProductModel(productModelId, productModel, profile.UserProfileId);

                if (updatedProductModel == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductModelToReturn = Mapper.Map<ProductModelDto>(updatedProductModel);
                return Created(updatedProductModelToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductModels(productModelId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductModels({productModelId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productModelId, [FromBody]Delta<ProductModelDto> productModelDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productModelRepository.ProductModelExists(productModelId))
                {
                    return NotFound();
                }

                var productModelToPatch = Mapper.Map<Delta<ProductModel>>(productModelDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productModelToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productModelRepository.PartialUpdateProductModel(productModelId, productModelToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductModels(productModelId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductModels({productModelId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productModelId)
        {
            try
            {
                if (!_productModelRepository.ProductModelExists(productModelId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productModelRepository.DeleteProductModel(productModelId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductModels(productModelId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
