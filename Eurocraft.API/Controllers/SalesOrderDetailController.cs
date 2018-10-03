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
    public class SalesOrderDetailController : ODataController
    {
        private IAccountRepository _accountRepository;
        private ISalesOrderDetailRepository _salesOrderDetailRepository;
        private ILogger<SalesOrderDetailRepository> _logger;

        public SalesOrderDetailController(IAccountRepository accountRepository, ISalesOrderDetailRepository salesOrderDetailRepository, ILogger<SalesOrderDetailRepository> logger)
        {
            _accountRepository = accountRepository;
            _salesOrderDetailRepository = salesOrderDetailRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/SalesOrderDetails")]
        public IActionResult Get()
        {
            try
            {
                var salesOrderDetails = _salesOrderDetailRepository.GetSalesOrderDetails();
                var results = Mapper.Map<IEnumerable<SalesOrderDetailDto>>(salesOrderDetails);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /SalesOrderDetails: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/SalesOrderDetails({salesOrderDetailId})")]
        public IActionResult Get([FromODataUri] int salesOrderDetailId)
        {
            try
            {
                var salesOrderDetail = _salesOrderDetailRepository.GetSalesOrderDetail(salesOrderDetailId);
                if (salesOrderDetail == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<SalesOrderDetailDto>(salesOrderDetail);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /SalesOrderDetails(salesOrderDetailId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        //[ODataRoute("SalesOrderDetails({salesOrderDetailId})/Color")]
        //[ODataRoute("SalesOrderDetails({salesOrderDetailId})/Color/$value")]
        public IActionResult GetSalesOrderDetailProperty([FromODataUri] int salesOrderDetailId, [FromODataUri] string property)
        {
            try
            {
                var salesOrderDetail = _salesOrderDetailRepository.GetSalesOrderDetail(salesOrderDetailId);
                if (salesOrderDetail == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = salesOrderDetail.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    salesOrderDetail = _salesOrderDetailRepository.GetSalesOrderDetail(salesOrderDetailId, propertyToGet);
                }

                if (!salesOrderDetail.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = salesOrderDetail.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetSalesOrderDetailProperty /SalesOrderDetails(salesOrderDetailId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/SalesOrderDetails")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]SalesOrderDetailDto salesOrderDetailDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var salesOrderDetail = Mapper.Map<SalesOrderDetail>(salesOrderDetailDto);
                if (_salesOrderDetailRepository.SalesOrderDetailExists(salesOrderDetail))
                {
                    return StatusCode(500, "SalesOrderDetail already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdSalesOrderDetail = _salesOrderDetailRepository.CreateSalesOrderDetail(salesOrderDetail, profile.UserProfileId);

                if (createdSalesOrderDetail == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdSalesOrderDetailToReturn = Mapper.Map<SalesOrderDetailDto>(createdSalesOrderDetail);
                return Created(createdSalesOrderDetailToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /SalesOrderDetails: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/SalesOrderDetails({salesOrderDetailId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int salesOrderDetailId, [FromBody]SalesOrderDetailDto salesOrderDetailDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_salesOrderDetailRepository.SalesOrderDetailExists(salesOrderDetailId))
                {
                    return NotFound();
                }

                var salesOrderDetail = Mapper.Map<SalesOrderDetail>(salesOrderDetailDto);
                if (_salesOrderDetailRepository.SalesOrderDetailExists(salesOrderDetail))
                {
                    return StatusCode(500, "SalesOrderDetail already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedSalesOrderDetail = _salesOrderDetailRepository.UpdateSalesOrderDetail(salesOrderDetailId, salesOrderDetail, profile.UserProfileId);

                if (updatedSalesOrderDetail == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedSalesOrderDetailToReturn = Mapper.Map<SalesOrderDetailDto>(updatedSalesOrderDetail);
                return Created(updatedSalesOrderDetailToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /SalesOrderDetails(salesOrderDetailId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/SalesOrderDetails({salesOrderDetailId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int salesOrderDetailId, [FromBody]Delta<SalesOrderDetailDto> salesOrderDetailDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_salesOrderDetailRepository.SalesOrderDetailExists(salesOrderDetailId))
                {
                    return NotFound();
                }

                var salesOrderDetailToPatch = Mapper.Map<Delta<SalesOrderDetail>>(salesOrderDetailDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(salesOrderDetailToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_salesOrderDetailRepository.PartialUpdateSalesOrderDetail(salesOrderDetailId, salesOrderDetailToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /SalesOrderDetails(salesOrderDetailId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/SalesOrderDetails({salesOrderDetailId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int salesOrderDetailId)
        {
            try
            {
                if (!_salesOrderDetailRepository.SalesOrderDetailExists(salesOrderDetailId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_salesOrderDetailRepository.DeleteSalesOrderDetail(salesOrderDetailId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /SalesOrderDetails(salesOrderDetailId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
