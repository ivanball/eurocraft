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
    public class SalesOrderHeaderController : ODataController
    {
        private IAccountRepository _accountRepository;
        private ISalesOrderHeaderRepository _salesOrderHeaderRepository;
        private ILogger<SalesOrderHeaderRepository> _logger;

        public SalesOrderHeaderController(IAccountRepository accountRepository, ISalesOrderHeaderRepository salesOrderHeaderRepository, ILogger<SalesOrderHeaderRepository> logger)
        {
            _accountRepository = accountRepository;
            _salesOrderHeaderRepository = salesOrderHeaderRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/SalesOrderHeaders")]
        public IActionResult Get()
        {
            try
            {
                var salesOrderHeaders = _salesOrderHeaderRepository.GetSalesOrderHeaders();
                var results = Mapper.Map<IEnumerable<SalesOrderHeaderDto>>(salesOrderHeaders);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /SalesOrderHeaders: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/SalesOrderHeaders({salesOrderId})")]
        public IActionResult Get([FromODataUri] int salesOrderId)
        {
            try
            {
                var salesOrderHeader = _salesOrderHeaderRepository.GetSalesOrderHeader(salesOrderId);
                if (salesOrderHeader == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<SalesOrderHeaderDto>(salesOrderHeader);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /SalesOrderHeaders(salesOrderId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        //[ODataRoute("SalesOrderHeaders({salesOrderId})/SalesOrderNo")]
        //[ODataRoute("SalesOrderHeaders({salesOrderId})/SalesOrderNo/$value")]
        public IActionResult GetSalesOrderHeaderProperty([FromODataUri] int salesOrderId, [FromODataUri] string property)
        {
            try
            {
                var salesOrderHeader = _salesOrderHeaderRepository.GetSalesOrderHeader(salesOrderId);
                if (salesOrderHeader == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = salesOrderHeader.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    salesOrderHeader = _salesOrderHeaderRepository.GetSalesOrderHeader(salesOrderId, propertyToGet);
                }

                if (!salesOrderHeader.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = salesOrderHeader.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetSalesOrderHeaderProperty /SalesOrderHeaders(salesOrderId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/SalesOrderHeaders")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]SalesOrderHeaderDto salesOrderHeaderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var salesOrderHeader = Mapper.Map<SalesOrderHeader>(salesOrderHeaderDto);
                if (_salesOrderHeaderRepository.SalesOrderHeaderExists(salesOrderHeader))
                {
                    return StatusCode(500, "SalesOrderHeader already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdSalesOrderHeader = _salesOrderHeaderRepository.CreateSalesOrderHeader(salesOrderHeader, profile.UserProfileId);

                if (createdSalesOrderHeader == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdSalesOrderHeaderToReturn = Mapper.Map<SalesOrderHeaderDto>(createdSalesOrderHeader);
                return Created(createdSalesOrderHeaderToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /SalesOrderHeaders: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/SalesOrderHeaders({salesOrderId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int salesOrderId, [FromBody]SalesOrderHeaderDto salesOrderHeaderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_salesOrderHeaderRepository.SalesOrderHeaderExists(salesOrderId))
                {
                    return NotFound();
                }

                var salesOrderHeader = Mapper.Map<SalesOrderHeader>(salesOrderHeaderDto);
                if (_salesOrderHeaderRepository.SalesOrderHeaderExists(salesOrderHeader))
                {
                    return StatusCode(500, "SalesOrderHeader already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedSalesOrderHeader = _salesOrderHeaderRepository.UpdateSalesOrderHeader(salesOrderId, salesOrderHeader, profile.UserProfileId);

                if (updatedSalesOrderHeader == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedSalesOrderHeaderToReturn = Mapper.Map<SalesOrderHeaderDto>(updatedSalesOrderHeader);
                return Created(updatedSalesOrderHeaderToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /SalesOrderHeaders(salesOrderId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/SalesOrderHeaders({salesOrderId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int salesOrderId, [FromBody]Delta<SalesOrderHeaderDto> salesOrderHeaderDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_salesOrderHeaderRepository.SalesOrderHeaderExists(salesOrderId))
                {
                    return NotFound();
                }

                var salesOrderHeaderToPatch = Mapper.Map<Delta<SalesOrderHeader>>(salesOrderHeaderDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(salesOrderHeaderToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_salesOrderHeaderRepository.PartialUpdateSalesOrderHeader(salesOrderId, salesOrderHeaderToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /SalesOrderHeaders(salesOrderId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/SalesOrderHeaders({salesOrderId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int salesOrderId)
        {
            try
            {
                if (!_salesOrderHeaderRepository.SalesOrderHeaderExists(salesOrderId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_salesOrderHeaderRepository.DeleteSalesOrderHeader(salesOrderId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /SalesOrderHeaders(salesOrderId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
