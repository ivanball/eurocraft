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
    public class BillOfMaterialController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IBillOfMaterialRepository _billOfMaterialRepository;
        private ILogger<BillOfMaterialRepository> _logger;

        public BillOfMaterialController(IAccountRepository accountRepository, IBillOfMaterialRepository billOfMaterialRepository, ILogger<BillOfMaterialRepository> logger)
        {
            _accountRepository = accountRepository;
            _billOfMaterialRepository = billOfMaterialRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/BillOfMaterials")]
        public IActionResult Get()
        {
            try
            {
                var billOfMaterials = _billOfMaterialRepository.GetBillOfMaterials();
                var results = Mapper.Map<IEnumerable<BillOfMaterialDto>>(billOfMaterials);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /BillOfMaterials: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/BillOfMaterials({billOfMaterialsId})")]
        public IActionResult Get([FromODataUri] int billOfMaterialsId)
        {
            try
            {
                var billOfMaterial = _billOfMaterialRepository.GetBillOfMaterial(billOfMaterialsId);
                if (billOfMaterial == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<BillOfMaterialDto>(billOfMaterial);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /BillOfMaterials(billOfMaterialsId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("BillOfMaterials({billOfMaterialsId})/HorizontalQuantity")]
        [ODataRoute("BillOfMaterials({billOfMaterialsId})/HorizontalQuantity/$value")]
        public IActionResult GetBillOfMaterialProperty([FromODataUri] int billOfMaterialsId, [FromODataUri] string property)
        {
            try
            {
                var billOfMaterial = _billOfMaterialRepository.GetBillOfMaterial(billOfMaterialsId);
                if (billOfMaterial == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = billOfMaterial.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    billOfMaterial = _billOfMaterialRepository.GetBillOfMaterial(billOfMaterialsId, propertyToGet);
                }

                if (!billOfMaterial.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = billOfMaterial.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetBillOfMaterialProperty /BillOfMaterials(billOfMaterialsId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/BillOfMaterials")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]BillOfMaterialDto billOfMaterialDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var billOfMaterial = Mapper.Map<BillOfMaterial>(billOfMaterialDto);
                if (_billOfMaterialRepository.BillOfMaterialExists(billOfMaterial))
                {
                    return StatusCode(500, "BillOfMaterial already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdBillOfMaterial = _billOfMaterialRepository.CreateBillOfMaterial(billOfMaterial, profile.UserProfileId);

                if (createdBillOfMaterial == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdBillOfMaterialToReturn = Mapper.Map<BillOfMaterialDto>(createdBillOfMaterial);
                return Created(createdBillOfMaterialToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /BillOfMaterials: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/BillOfMaterials({billOfMaterialsId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int billOfMaterialsId, [FromBody]BillOfMaterialDto billOfMaterialDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_billOfMaterialRepository.BillOfMaterialExists(billOfMaterialsId))
                {
                    return NotFound();
                }

                var billOfMaterial = Mapper.Map<BillOfMaterial>(billOfMaterialDto);
                if (_billOfMaterialRepository.BillOfMaterialExists(billOfMaterial))
                {
                    return StatusCode(500, "BillOfMaterial already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedBillOfMaterial = _billOfMaterialRepository.UpdateBillOfMaterial(billOfMaterialsId, billOfMaterial, profile.UserProfileId);

                if (updatedBillOfMaterial == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedBillOfMaterialToReturn = Mapper.Map<BillOfMaterialDto>(updatedBillOfMaterial);
                return Created(updatedBillOfMaterialToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /BillOfMaterials(billOfMaterialsId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/BillOfMaterials({billOfMaterialsId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int billOfMaterialsId, [FromBody]Delta<BillOfMaterialDto> billOfMaterialDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_billOfMaterialRepository.BillOfMaterialExists(billOfMaterialsId))
                {
                    return NotFound();
                }

                var billOfMaterialToPatch = Mapper.Map<Delta<BillOfMaterial>>(billOfMaterialDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(billOfMaterialToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_billOfMaterialRepository.PartialUpdateBillOfMaterial(billOfMaterialsId, billOfMaterialToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /BillOfMaterials(billOfMaterialsId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/BillOfMaterials({billOfMaterialsId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int billOfMaterialsId)
        {
            try
            {
                if (!_billOfMaterialRepository.BillOfMaterialExists(billOfMaterialsId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_billOfMaterialRepository.DeleteBillOfMaterial(billOfMaterialsId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /BillOfMaterials(billOfMaterialsId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
