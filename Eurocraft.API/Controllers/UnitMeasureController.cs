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
    public class UnitMeasureController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IUnitMeasureRepository _unitMeasureRepository;
        private ILogger<UnitMeasureRepository> _logger;

        public UnitMeasureController(IAccountRepository accountRepository, IUnitMeasureRepository unitMeasureRepository, ILogger<UnitMeasureRepository> logger)
        {
            _accountRepository = accountRepository;
            _unitMeasureRepository = unitMeasureRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/UnitMeasures")]
        public IActionResult Get()
        {
            try
            {
                var unitMeasures = _unitMeasureRepository.GetUnitMeasures();
                var results = Mapper.Map<IEnumerable<UnitMeasureDto>>(unitMeasures);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /UnitMeasures: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/UnitMeasures({unitMeasureId})")]
        public IActionResult Get([FromODataUri] int unitMeasureId)
        {
            try
            {
                var unitMeasure = _unitMeasureRepository.GetUnitMeasure(unitMeasureId);
                if (unitMeasure == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<UnitMeasureDto>(unitMeasure);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /UnitMeasures(unitMeasureId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("UnitMeasures({unitMeasureId})/UnitMeasureName")]
        [ODataRoute("UnitMeasures({unitMeasureId})/UnitMeasureName/$value")]
        public IActionResult GetUnitMeasureProperty([FromODataUri] int unitMeasureId, [FromODataUri] string property)
        {
            try
            {
                var unitMeasure = _unitMeasureRepository.GetUnitMeasure(unitMeasureId);
                if (unitMeasure == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = unitMeasure.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    unitMeasure = _unitMeasureRepository.GetUnitMeasure(unitMeasureId, propertyToGet);
                }

                if (!unitMeasure.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = unitMeasure.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetUnitMeasureProperty /UnitMeasures(unitMeasureId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/UnitMeasures")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]UnitMeasureDto unitMeasureDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var unitMeasure = Mapper.Map<UnitMeasure>(unitMeasureDto);
                if (_unitMeasureRepository.UnitMeasureExists(unitMeasure))
                {
                    return StatusCode(500, "UnitMeasure already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdUnitMeasure = _unitMeasureRepository.CreateUnitMeasure(unitMeasure, profile.UserProfileId);

                if (createdUnitMeasure == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdUnitMeasureToReturn = Mapper.Map<UnitMeasureDto>(createdUnitMeasure);
                return Created(createdUnitMeasureToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /UnitMeasures: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/UnitMeasures({unitMeasureId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int unitMeasureId, [FromBody]UnitMeasureDto unitMeasureDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_unitMeasureRepository.UnitMeasureExists(unitMeasureId))
                {
                    return NotFound();
                }

                var unitMeasure = Mapper.Map<UnitMeasure>(unitMeasureDto);
                if (_unitMeasureRepository.UnitMeasureExists(unitMeasure))
                {
                    return StatusCode(500, "UnitMeasure already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedUnitMeasure = _unitMeasureRepository.UpdateUnitMeasure(unitMeasureId, unitMeasure, profile.UserProfileId);

                if (updatedUnitMeasure == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedUnitMeasureToReturn = Mapper.Map<UnitMeasureDto>(updatedUnitMeasure);
                return Created(updatedUnitMeasureToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /UnitMeasures(unitMeasureId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/UnitMeasures({unitMeasureId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int unitMeasureId, [FromBody]Delta<UnitMeasureDto> unitMeasureDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_unitMeasureRepository.UnitMeasureExists(unitMeasureId))
                {
                    return NotFound();
                }

                var unitMeasureToPatch = Mapper.Map<Delta<UnitMeasure>>(unitMeasureDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(unitMeasureToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_unitMeasureRepository.PartialUpdateUnitMeasure(unitMeasureId, unitMeasureToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /UnitMeasures(unitMeasureId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/UnitMeasures({unitMeasureId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int unitMeasureId)
        {
            try
            {
                if (!_unitMeasureRepository.UnitMeasureExists(unitMeasureId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_unitMeasureRepository.DeleteUnitMeasure(unitMeasureId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /UnitMeasures(unitMeasureId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
