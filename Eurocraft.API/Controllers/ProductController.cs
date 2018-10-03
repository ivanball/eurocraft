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
    public class ProductController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IProductRepository _productRepository;
        private ILogger<ProductRepository> _logger;

        public ProductController(IAccountRepository accountRepository, IProductRepository productRepository, ILogger<ProductRepository> logger)
        {
            _accountRepository = accountRepository;
            _productRepository = productRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Products")]
        public IActionResult Get()
        {
            try
            {
                var products = _productRepository.GetProducts();
                var results = Mapper.Map<IEnumerable<ProductDto>>(products);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Products: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Products({productId})")]
        public IActionResult Get([FromODataUri] int productId)
        {
            try
            {
                var product = _productRepository.GetProduct(productId);
                if (product == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<ProductDto>(product);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Products(productId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("Products({productId})/ProductName")]
        [ODataRoute("Products({productId})/ProductName/$value")]
        public IActionResult GetProductProperty([FromODataUri] int productId, [FromODataUri] string property)
        {
            try
            {
                var product = _productRepository.GetProduct(productId);
                if (product == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = product.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    product = _productRepository.GetProduct(productId, propertyToGet);
                }

                if (!product.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = product.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetProductProperty /Products(productId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/Products")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]ProductDto productDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = Mapper.Map<Product>(productDto);
                if (_productRepository.ProductExists(product))
                {
                    return StatusCode(500, "Product already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdProduct = _productRepository.CreateProduct(product, profile.UserProfileId);

                if (createdProduct == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdProductToReturn = Mapper.Map<ProductDto>(createdProduct);
                return Created(createdProductToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /Products: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/Products({productId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int productId, [FromBody]ProductDto productDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productRepository.ProductExists(productId))
                {
                    return NotFound();
                }

                var product = Mapper.Map<Product>(productDto);
                if (_productRepository.ProductExists(product))
                {
                    return StatusCode(500, "Product already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedProduct = _productRepository.UpdateProduct(productId, product, profile.UserProfileId);

                if (updatedProduct == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedProductToReturn = Mapper.Map<ProductDto>(updatedProduct);
                return Created(updatedProductToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /Products(productId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/Products({productId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int productId, [FromBody]Delta<ProductDto> productDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_productRepository.ProductExists(productId))
                {
                    return NotFound();
                }

                var productToPatch = Mapper.Map<Delta<Product>>(productDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(productToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productRepository.PartialUpdateProduct(productId, productToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /Products(productId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/Products({productId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int productId)
        {
            try
            {
                if (!_productRepository.ProductExists(productId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_productRepository.DeleteProduct(productId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /Products(productId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
