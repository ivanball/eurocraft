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
    public class StateProvinceController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IStateProvinceRepository _stateProvinceRepository;
        private ILogger<StateProvinceRepository> _logger;

        public StateProvinceController(IAccountRepository accountRepository, IStateProvinceRepository stateProvinceRepository, ILogger<StateProvinceRepository> logger)
        {
            _accountRepository = accountRepository;
            _stateProvinceRepository = stateProvinceRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/StateProvinces")]
        public IActionResult Get()
        {
            try
            {
                var stateProvinces = _stateProvinceRepository.GetStateProvinces();
                var results = Mapper.Map<IEnumerable<StateProvinceDto>>(stateProvinces);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /StateProvinces: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/StateProvinces({stateProvinceId})")]
        public IActionResult Get([FromODataUri] int stateProvinceId)
        {
            try
            {
                var stateProvince = _stateProvinceRepository.GetStateProvince(stateProvinceId);
                if (stateProvince == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<StateProvinceDto>(stateProvince);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /StateProvinces(stateProvinceId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("StateProvinces({stateProvinceId})/StateProvinceName")]
        [ODataRoute("StateProvinces({stateProvinceId})/StateProvinceName/$value")]
        public IActionResult GetStateProvinceProperty([FromODataUri] int stateProvinceId, [FromODataUri] string property)
        {
            try
            {
                var stateProvince = _stateProvinceRepository.GetStateProvince(stateProvinceId);
                if (stateProvince == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = stateProvince.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    stateProvince = _stateProvinceRepository.GetStateProvince(stateProvinceId, propertyToGet);
                }

                if (!stateProvince.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = stateProvince.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetStateProvinceProperty /StateProvinces(stateProvinceId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/StateProvinces")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]StateProvinceDto stateProvinceDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var stateProvince = Mapper.Map<StateProvince>(stateProvinceDto);
                if (_stateProvinceRepository.StateProvinceExists(stateProvince))
                {
                    return StatusCode(500, "StateProvince already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdStateProvince = _stateProvinceRepository.CreateStateProvince(stateProvince, profile.UserProfileId);

                if (createdStateProvince == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdStateProvinceToReturn = Mapper.Map<StateProvinceDto>(createdStateProvince);
                return Created(createdStateProvinceToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /StateProvinces: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/StateProvinces({stateProvinceId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int stateProvinceId, [FromBody]StateProvinceDto stateProvinceDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_stateProvinceRepository.StateProvinceExists(stateProvinceId))
                {
                    return NotFound();
                }

                var stateProvince = Mapper.Map<StateProvince>(stateProvinceDto);
                if (_stateProvinceRepository.StateProvinceExists(stateProvince))
                {
                    return StatusCode(500, "StateProvince already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedStateProvince = _stateProvinceRepository.UpdateStateProvince(stateProvinceId, stateProvince, profile.UserProfileId);

                if (updatedStateProvince == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedStateProvinceToReturn = Mapper.Map<StateProvinceDto>(updatedStateProvince);
                return Created(updatedStateProvinceToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /StateProvinces(stateProvinceId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/StateProvinces({stateProvinceId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int stateProvinceId, [FromBody]Delta<StateProvinceDto> stateProvinceDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_stateProvinceRepository.StateProvinceExists(stateProvinceId))
                {
                    return NotFound();
                }

                var stateProvinceToPatch = Mapper.Map<Delta<StateProvince>>(stateProvinceDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(stateProvinceToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_stateProvinceRepository.PartialUpdateStateProvince(stateProvinceId, stateProvinceToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /StateProvinces(stateProvinceId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/StateProvinces({stateProvinceId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int stateProvinceId)
        {
            try
            {
                if (!_stateProvinceRepository.StateProvinceExists(stateProvinceId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_stateProvinceRepository.DeleteStateProvince(stateProvinceId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /StateProvinces(stateProvinceId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
