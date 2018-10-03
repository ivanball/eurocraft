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
    public class AddressTypeController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IAddressTypeRepository _addressTypeRepository;
        private ILogger<AddressTypeRepository> _logger;

        public AddressTypeController(IAccountRepository accountRepository, IAddressTypeRepository addressTypeRepository, ILogger<AddressTypeRepository> logger)
        {
            _accountRepository = accountRepository;
            _addressTypeRepository = addressTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/AddressTypes")]
        public IActionResult Get()
        {
            try
            {
                var addressTypes = _addressTypeRepository.GetAddressTypes();
                var results = Mapper.Map<IEnumerable<AddressTypeDto>>(addressTypes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /AddressTypes: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/AddressTypes({addressTypeId})")]
        public IActionResult Get([FromODataUri] int addressTypeId)
        {
            try
            {
                var addressType = _addressTypeRepository.GetAddressType(addressTypeId);
                if (addressType == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<AddressTypeDto>(addressType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /AddressTypes(addressTypeId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("AddressTypes({addressTypeId})/AddressTypeName")]
        [ODataRoute("AddressTypes({addressTypeId})/AddressTypeName/$value")]
        public IActionResult GetAddressTypeProperty([FromODataUri] int addressTypeId, [FromODataUri] string property)
        {
            try
            {
                var addressType = _addressTypeRepository.GetAddressType(addressTypeId);
                if (addressType == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = addressType.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    addressType = _addressTypeRepository.GetAddressType(addressTypeId, propertyToGet);
                }

                if (!addressType.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = addressType.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetAddressTypeProperty /AddressTypes(addressTypeId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/AddressTypes")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]AddressTypeDto addressTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var addressType = Mapper.Map<AddressType>(addressTypeDto);
                if (_addressTypeRepository.AddressTypeExists(addressType))
                {
                    return StatusCode(500, "AddressType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdAddressType = _addressTypeRepository.CreateAddressType(addressType, profile.UserProfileId);

                if (createdAddressType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdAddressTypeToReturn = Mapper.Map<AddressTypeDto>(createdAddressType);
                return Created(createdAddressTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /AddressTypes: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/AddressTypes({addressTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int addressTypeId, [FromBody]AddressTypeDto addressTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_addressTypeRepository.AddressTypeExists(addressTypeId))
                {
                    return NotFound();
                }

                var addressType = Mapper.Map<AddressType>(addressTypeDto);
                if (_addressTypeRepository.AddressTypeExists(addressType))
                {
                    return StatusCode(500, "AddressType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedAddressType = _addressTypeRepository.UpdateAddressType(addressTypeId, addressType, profile.UserProfileId);

                if (updatedAddressType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedAddressTypeToReturn = Mapper.Map<AddressTypeDto>(updatedAddressType);
                return Created(updatedAddressTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /AddressTypes(addressTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/AddressTypes({addressTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int addressTypeId, [FromBody]Delta<AddressTypeDto> addressTypeDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_addressTypeRepository.AddressTypeExists(addressTypeId))
                {
                    return NotFound();
                }

                var addressTypeToPatch = Mapper.Map<Delta<AddressType>>(addressTypeDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(addressTypeToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_addressTypeRepository.PartialUpdateAddressType(addressTypeId, addressTypeToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /AddressTypes(addressTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/AddressTypes({addressTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int addressTypeId)
        {
            try
            {
                if (!_addressTypeRepository.AddressTypeExists(addressTypeId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_addressTypeRepository.DeleteAddressType(addressTypeId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /AddressTypes(addressTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
