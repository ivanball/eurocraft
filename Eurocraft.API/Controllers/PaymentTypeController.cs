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
    public class PaymentTypeController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IPaymentTypeRepository _paymentTypeRepository;
        private ILogger<PaymentTypeRepository> _logger;

        public PaymentTypeController(IAccountRepository accountRepository, IPaymentTypeRepository paymentTypeRepository, ILogger<PaymentTypeRepository> logger)
        {
            _accountRepository = accountRepository;
            _paymentTypeRepository = paymentTypeRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/PaymentTypes")]
        public IActionResult Get()
        {
            try
            {
                var paymentTypes = _paymentTypeRepository.GetPaymentTypes();
                var results = Mapper.Map<IEnumerable<PaymentTypeDto>>(paymentTypes);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /PaymentTypes: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/PaymentTypes({paymentTypeId})")]
        public IActionResult Get([FromODataUri] int paymentTypeId)
        {
            try
            {
                var paymentType = _paymentTypeRepository.GetPaymentType(paymentTypeId);
                if (paymentType == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<PaymentTypeDto>(paymentType);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /PaymentTypes(paymentTypeId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("PaymentTypes({paymentTypeId})/PaymentTypeName")]
        [ODataRoute("PaymentTypes({paymentTypeId})/PaymentTypeName/$value")]
        public IActionResult GetPaymentTypeProperty([FromODataUri] int paymentTypeId, [FromODataUri] string property)
        {
            try
            {
                var paymentType = _paymentTypeRepository.GetPaymentType(paymentTypeId);
                if (paymentType == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = paymentType.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    paymentType = _paymentTypeRepository.GetPaymentType(paymentTypeId, propertyToGet);
                }

                if (!paymentType.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = paymentType.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetPaymentTypeProperty /PaymentTypes(paymentTypeId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/PaymentTypes")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Post([FromBody]PaymentTypeDto paymentTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var paymentType = Mapper.Map<PaymentType>(paymentTypeDto);
                if (_paymentTypeRepository.PaymentTypeExists(paymentType))
                {
                    return StatusCode(500, "PaymentType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdPaymentType = _paymentTypeRepository.CreatePaymentType(paymentType, profile.UserProfileId);

                if (createdPaymentType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdPaymentTypeToReturn = Mapper.Map<PaymentTypeDto>(createdPaymentType);
                return Created(createdPaymentTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /PaymentTypes: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/PaymentTypes({paymentTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Put([FromODataUri] int paymentTypeId, [FromBody]PaymentTypeDto paymentTypeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_paymentTypeRepository.PaymentTypeExists(paymentTypeId))
                {
                    return NotFound();
                }

                var paymentType = Mapper.Map<PaymentType>(paymentTypeDto);
                if (_paymentTypeRepository.PaymentTypeExists(paymentType))
                {
                    return StatusCode(500, "PaymentType already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedPaymentType = _paymentTypeRepository.UpdatePaymentType(paymentTypeId, paymentType, profile.UserProfileId);

                if (updatedPaymentType == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedPaymentTypeToReturn = Mapper.Map<PaymentTypeDto>(updatedPaymentType);
                return Created(updatedPaymentTypeToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /PaymentTypes(paymentTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/PaymentTypes({paymentTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Patch([FromODataUri] int paymentTypeId, [FromBody]Delta<PaymentTypeDto> paymentTypeDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_paymentTypeRepository.PaymentTypeExists(paymentTypeId))
                {
                    return NotFound();
                }

                var paymentTypeToPatch = Mapper.Map<Delta<PaymentType>>(paymentTypeDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(paymentTypeToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_paymentTypeRepository.PartialUpdatePaymentType(paymentTypeId, paymentTypeToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /PaymentTypes(paymentTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/PaymentTypes({paymentTypeId})")]
        [Authorize(Roles = "Administrators")]
        public IActionResult Delete([FromODataUri] int paymentTypeId)
        {
            try
            {
                if (!_paymentTypeRepository.PaymentTypeExists(paymentTypeId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_paymentTypeRepository.DeletePaymentType(paymentTypeId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /PaymentTypes(paymentTypeId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
