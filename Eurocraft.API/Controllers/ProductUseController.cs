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
    public class ProductUseController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductUseRepository _productUseRepository;
        private ILogger<ProductUseRepository> _logger;

        public ProductUseController(IAccountRepository accountRepository, IProductUseRepository productUseRepository, ILogger<ProductUseRepository> logger)
        {
            _accountRepository = accountRepository;
            _productUseRepository = productUseRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductUses")]
        public IActionResult Get()
        {
            try
            {
                var productUses = _productUseRepository.GetProductUses();
                var results = Mapper.Map<IEnumerable<ProductUseDto>>(productUses);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductUses: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/ProductUses({productUseId})")]
        public IActionResult Get([FromODataUri] int productUseId)
        {
            try
            {
                var productUse = _productUseRepository.GetProductUse(productUseId);
                if (productUse == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductUseDto>(productUse);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /ProductUses(productUseId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("ProductUses({productUseId})/ProductUseName")]
        [ODataRoute("ProductUses({productUseId})/ProductUseName/$value")]
        public IActionResult GetProductUseProperty([FromODataUri] int productUseId, [FromODataUri] string property)
        {
            try
            {
                var productUse = _productUseRepository.GetProductUse(productUseId);
                if (productUse == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = productUse.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    productUse = _productUseRepository.GetProductUse(productUseId, propertyToGet);
                }

                if (!productUse.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = productUse.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductUseProperty /ProductUses(productUseId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/ProductUses")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductUseDto productUseDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var productUse = Mapper.Map<ProductUse>(productUseDto);
                if (_productUseRepository.ProductUseExists(productUse))
                {
                    return StatusCode(500, "ProductUse already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProductUse = _productUseRepository.CreateProductUse(productUse, profile.UserProfileId);

                if (createdProductUse == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductUseToReturn = Mapper.Map<ProductUseDto>(createdProductUse);
                return Created(createdProductUseToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /ProductUses: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/ProductUses({productUseId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productUseId, [FromBody]ProductUseDto productUseDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productUseRepository.ProductUseExists(productUseId))
                {
                    return NotFound();
                }

                var productUse = Mapper.Map<ProductUse>(productUseDto);
                if (_productUseRepository.ProductUseExists(productUse))
                {
                    return StatusCode(500, "ProductUse already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProductUse = _productUseRepository.UpdateProductUse(productUseId, productUse, profile.UserProfileId);

                if (updatedProductUse == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductUseToReturn = Mapper.Map<ProductUseDto>(updatedProductUse);
                return Created(updatedProductUseToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /ProductUses(productUseId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/ProductUses({productUseId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productUseId, [FromBody]Delta<ProductUseDto> productUseDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productUseRepository.ProductUseExists(productUseId))
                {
                    return NotFound();
                }

                var productUseToPatch = Mapper.Map<Delta<ProductUse>>(productUseDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productUseToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productUseRepository.PartialUpdateProductUse(productUseId, productUseToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /ProductUses(productUseId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/ProductUses({productUseId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productUseId)
        {
            try
            {
                if (!_productUseRepository.ProductUseExists(productUseId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productUseRepository.DeleteProductUse(productUseId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /ProductUses(productUseId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
