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
    public class CountryRegionController : ODataController
    {
        private IAccountRepository _accountRepository;
        private ICountryRegionRepository _countryRegionRepository;
        private ILogger<CountryRegionRepository> _logger;

        public CountryRegionController(IAccountRepository accountRepository, ICountryRegionRepository countryRegionRepository, ILogger<CountryRegionRepository> logger)
        {
            _accountRepository = accountRepository;
            _countryRegionRepository = countryRegionRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/CountryRegions")]
        public IActionResult Get()
        {
            try
            {
                var countryRegions = _countryRegionRepository.GetCountryRegions();
                var results = Mapper.Map<IEnumerable<CountryRegionDto>>(countryRegions);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /CountryRegions: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/CountryRegions({countryRegionId})")]
        public IActionResult Get([FromODataUri] int countryRegionId)
        {
            try
            {
                var countryRegion = _countryRegionRepository.GetCountryRegion(countryRegionId);
                if (countryRegion == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<CountryRegionDto>(countryRegion);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /CountryRegions(countryRegionId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("CountryRegions({countryRegionId})/CountryRegionName")]
        [ODataRoute("CountryRegions({countryRegionId})/CountryRegionName/$value")]
        public IActionResult GetCountryRegionProperty([FromODataUri] int countryRegionId, [FromODataUri] string property)
        {
            try
            {
                var countryRegion = _countryRegionRepository.GetCountryRegion(countryRegionId);
                if (countryRegion == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = countryRegion.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    countryRegion = _countryRegionRepository.GetCountryRegion(countryRegionId, propertyToGet);
                }

                if (!countryRegion.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = countryRegion.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetCountryRegionProperty /CountryRegions(countryRegionId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/CountryRegions")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]CountryRegionDto countryRegionDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var countryRegion = Mapper.Map<CountryRegion>(countryRegionDto);
                if (_countryRegionRepository.CountryRegionExists(countryRegion))
                {
                    return StatusCode(500, "CountryRegion already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdCountryRegion = _countryRegionRepository.CreateCountryRegion(countryRegion, profile.UserProfileId);

                if (createdCountryRegion == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdCountryRegionToReturn = Mapper.Map<CountryRegionDto>(createdCountryRegion);
                return Created(createdCountryRegionToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /CountryRegions: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/CountryRegions({countryRegionId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int countryRegionId, [FromBody]CountryRegionDto countryRegionDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_countryRegionRepository.CountryRegionExists(countryRegionId))
                {
                    return NotFound();
                }

                var countryRegion = Mapper.Map<CountryRegion>(countryRegionDto);
                if (_countryRegionRepository.CountryRegionExists(countryRegion))
                {
                    return StatusCode(500, "CountryRegion already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedCountryRegion = _countryRegionRepository.UpdateCountryRegion(countryRegionId, countryRegion, profile.UserProfileId);

                if (updatedCountryRegion == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedCountryRegionToReturn = Mapper.Map<CountryRegionDto>(updatedCountryRegion);
                return Created(updatedCountryRegionToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /CountryRegions(countryRegionId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/CountryRegions({countryRegionId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int countryRegionId, [FromBody]Delta<CountryRegionDto> countryRegionDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_countryRegionRepository.CountryRegionExists(countryRegionId))
                {
                    return NotFound();
                }

                var countryRegionToPatch = Mapper.Map<Delta<CountryRegion>>(countryRegionDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(countryRegionToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_countryRegionRepository.PartialUpdateCountryRegion(countryRegionId, countryRegionToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /CountryRegions(countryRegionId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/CountryRegions({countryRegionId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int countryRegionId)
        {
            try
            {
                if (!_countryRegionRepository.CountryRegionExists(countryRegionId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_countryRegionRepository.DeleteCountryRegion(countryRegionId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /CountryRegions(countryRegionId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
