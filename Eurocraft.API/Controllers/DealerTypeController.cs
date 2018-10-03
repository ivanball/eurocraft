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
    public class DealerTypeController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IDealerTypeRepository _dealerTypeRepository;
        private ILogger<DealerTypeRepository> _logger;

        public DealerTypeController(IAccountRepository accountRepository, IDealerTypeRepository dealerTypeRepository, ILogger<DealerTypeRepository> logger)
        {
            _accountRepository = accountRepository;
            _dealerTypeRepository = dealerTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/DealerTypes")]
        public IActionResult Get()
        {
            try
            {
                var dealerTypes = _dealerTypeRepository.GetDealerTypes();
                var results = Mapper.Map<IEnumerable<DealerTypeDto>>(dealerTypes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /DealerTypes: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/DealerTypes({dealerTypeId})")]
        public IActionResult Get([FromODataUri] int dealerTypeId)
        {
            try
            {
                var dealerType = _dealerTypeRepository.GetDealerType(dealerTypeId);
                if (dealerType == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<DealerTypeDto>(dealerType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /DealerTypes(dealerTypeId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("DealerTypes({dealerTypeId})/DealerTypeName")]
        [ODataRoute("DealerTypes({dealerTypeId})/DealerTypeName/$value")]
        public IActionResult GetDealerTypeProperty([FromODataUri] int dealerTypeId, [FromODataUri] string property)
        {
            try
            {
                var dealerType = _dealerTypeRepository.GetDealerType(dealerTypeId);
                if (dealerType == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = dealerType.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    dealerType = _dealerTypeRepository.GetDealerType(dealerTypeId, propertyToGet);
                }

                if (!dealerType.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = dealerType.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetDealerTypeProperty /DealerTypes(dealerTypeId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/DealerTypes")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]DealerTypeDto dealerTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var dealerType = Mapper.Map<DealerType>(dealerTypeDto);
                if (_dealerTypeRepository.DealerTypeExists(dealerType))
                {
                    return StatusCode(500, "DealerType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdDealerType = _dealerTypeRepository.CreateDealerType(dealerType, profile.UserProfileId);

                if (createdDealerType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdDealerTypeToReturn = Mapper.Map<DealerTypeDto>(createdDealerType);
                return Created(createdDealerTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /DealerTypes: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/DealerTypes({dealerTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int dealerTypeId, [FromBody]DealerTypeDto dealerTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_dealerTypeRepository.DealerTypeExists(dealerTypeId))
                {
                    return NotFound();
                }

                var dealerType = Mapper.Map<DealerType>(dealerTypeDto);
                if (_dealerTypeRepository.DealerTypeExists(dealerType))
                {
                    return StatusCode(500, "DealerType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedDealerType = _dealerTypeRepository.UpdateDealerType(dealerTypeId, dealerType, profile.UserProfileId);

                if (updatedDealerType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedDealerTypeToReturn = Mapper.Map<DealerTypeDto>(updatedDealerType);
                return Created(updatedDealerTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /DealerTypes(dealerTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/DealerTypes({dealerTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int dealerTypeId, [FromBody]Delta<DealerTypeDto> dealerTypeDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_dealerTypeRepository.DealerTypeExists(dealerTypeId))
                {
                    return NotFound();
                }

                var dealerTypeToPatch = Mapper.Map<Delta<DealerType>>(dealerTypeDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(dealerTypeToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_dealerTypeRepository.PartialUpdateDealerType(dealerTypeId, dealerTypeToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /DealerTypes(dealerTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/DealerTypes({dealerTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int dealerTypeId)
        {
            try
            {
                if (!_dealerTypeRepository.DealerTypeExists(dealerTypeId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_dealerTypeRepository.DeleteDealerType(dealerTypeId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /DealerTypes(dealerTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
