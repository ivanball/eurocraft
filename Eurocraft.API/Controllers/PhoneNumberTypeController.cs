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
    public class PhoneNumberTypeController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IPhoneNumberTypeRepository _phoneNumberTypeRepository;
        private ILogger<PhoneNumberTypeRepository> _logger;

        public PhoneNumberTypeController(IAccountRepository accountRepository, IPhoneNumberTypeRepository phoneNumberTypeRepository, ILogger<PhoneNumberTypeRepository> logger)
        {
            _accountRepository = accountRepository;
            _phoneNumberTypeRepository = phoneNumberTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/PhoneNumberTypes")]
        public IActionResult Get()
        {
            try
            {
                var phoneNumberTypes = _phoneNumberTypeRepository.GetPhoneNumberTypes();
                var results = Mapper.Map<IEnumerable<PhoneNumberTypeDto>>(phoneNumberTypes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /PhoneNumberTypes: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/PhoneNumberTypes({phoneNumberTypeId})")]
        public IActionResult Get([FromODataUri] int phoneNumberTypeId)
        {
            try
            {
                var phoneNumberType = _phoneNumberTypeRepository.GetPhoneNumberType(phoneNumberTypeId);
                if (phoneNumberType == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<PhoneNumberTypeDto>(phoneNumberType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /PhoneNumberTypes(phoneNumberTypeId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("PhoneNumberTypes({phoneNumberTypeId})/PhoneNumberTypeName")]
        [ODataRoute("PhoneNumberTypes({phoneNumberTypeId})/PhoneNumberTypeName/$value")]
        public IActionResult GetPhoneNumberTypeProperty([FromODataUri] int phoneNumberTypeId, [FromODataUri] string property)
        {
            try
            {
                var phoneNumberType = _phoneNumberTypeRepository.GetPhoneNumberType(phoneNumberTypeId);
                if (phoneNumberType == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = phoneNumberType.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    phoneNumberType = _phoneNumberTypeRepository.GetPhoneNumberType(phoneNumberTypeId, propertyToGet);
                }

                if (!phoneNumberType.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = phoneNumberType.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetPhoneNumberTypeProperty /PhoneNumberTypes(phoneNumberTypeId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/PhoneNumberTypes")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]PhoneNumberTypeDto phoneNumberTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var phoneNumberType = Mapper.Map<PhoneNumberType>(phoneNumberTypeDto);
                if (_phoneNumberTypeRepository.PhoneNumberTypeExists(phoneNumberType))
                {
                    return StatusCode(500, "PhoneNumberType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdPhoneNumberType = _phoneNumberTypeRepository.CreatePhoneNumberType(phoneNumberType, profile.UserProfileId);

                if (createdPhoneNumberType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdPhoneNumberTypeToReturn = Mapper.Map<PhoneNumberTypeDto>(createdPhoneNumberType);
                return Created(createdPhoneNumberTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /PhoneNumberTypes: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/PhoneNumberTypes({phoneNumberTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int phoneNumberTypeId, [FromBody]PhoneNumberTypeDto phoneNumberTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_phoneNumberTypeRepository.PhoneNumberTypeExists(phoneNumberTypeId))
                {
                    return NotFound();
                }

                var phoneNumberType = Mapper.Map<PhoneNumberType>(phoneNumberTypeDto);
                if (_phoneNumberTypeRepository.PhoneNumberTypeExists(phoneNumberType))
                {
                    return StatusCode(500, "PhoneNumberType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedPhoneNumberType = _phoneNumberTypeRepository.UpdatePhoneNumberType(phoneNumberTypeId, phoneNumberType, profile.UserProfileId);

                if (updatedPhoneNumberType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedPhoneNumberTypeToReturn = Mapper.Map<PhoneNumberTypeDto>(updatedPhoneNumberType);
                return Created(updatedPhoneNumberTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /PhoneNumberTypes(phoneNumberTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/PhoneNumberTypes({phoneNumberTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int phoneNumberTypeId, [FromBody]Delta<PhoneNumberTypeDto> phoneNumberTypeDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_phoneNumberTypeRepository.PhoneNumberTypeExists(phoneNumberTypeId))
                {
                    return NotFound();
                }

                var phoneNumberTypeToPatch = Mapper.Map<Delta<PhoneNumberType>>(phoneNumberTypeDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(phoneNumberTypeToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_phoneNumberTypeRepository.PartialUpdatePhoneNumberType(phoneNumberTypeId, phoneNumberTypeToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /PhoneNumberTypes(phoneNumberTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/PhoneNumberTypes({phoneNumberTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int phoneNumberTypeId)
        {
            try
            {
                if (!_phoneNumberTypeRepository.PhoneNumberTypeExists(phoneNumberTypeId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_phoneNumberTypeRepository.DeletePhoneNumberType(phoneNumberTypeId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /PhoneNumberTypes(phoneNumberTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
