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
    public class DealerController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IDealerRepository _dealerRepository;
        private ILogger<DealerRepository> _logger;

        public DealerController(IAccountRepository accountRepository, IDealerRepository dealerRepository, ILogger<DealerRepository> logger)
        {
            _accountRepository = accountRepository;
            _dealerRepository = dealerRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Dealers")]
        public IActionResult Get()
        {
            try
            {
                var dealers = _dealerRepository.GetDealers();
                var results = Mapper.Map<IEnumerable<DealerDto>>(dealers);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Dealers: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Dealers({businessEntityId})")]
        public IActionResult Get([FromODataUri] int businessEntityId)
        {
            try
            {
                var dealer = _dealerRepository.GetDealer(businessEntityId);
                if (dealer == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<DealerDto>(dealer);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Dealers(businessEntityId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("Dealers({businessEntityId})/DealerName")]
        [ODataRoute("Dealers({businessEntityId})/DealerName/$value")]
        public IActionResult GetDealerProperty([FromODataUri] int businessEntityId, [FromODataUri] string property)
        {
            try
            {
                var dealer = _dealerRepository.GetDealer(businessEntityId);
                if (dealer == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = dealer.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    dealer = _dealerRepository.GetDealer(businessEntityId, propertyToGet);
                }

                if (!dealer.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = dealer.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetDealerProperty /Dealers(businessEntityId)/property: {ex}");
                return BadRequest();
            }
        }

        [HttpPost]
        [ODataRoute("/Dealers")]
        public IActionResult Post([FromBody]DealerDto dealerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var dealer = Mapper.Map<Dealer>(dealerDto);
                if (_dealerRepository.DealerExists(dealer))
                {
                    return StatusCode(500, "Dealer already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdDealer = _dealerRepository.CreateDealer(dealer, profile.UserProfileId);

                if (createdDealer == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdDealerToReturn = Mapper.Map<DealerDto>(createdDealer);
                return Created(createdDealerToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /Dealers: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/Dealers({businessEntityId})")]
        public IActionResult Put([FromODataUri] int businessEntityId, [FromBody]DealerDto dealerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_dealerRepository.DealerExists(businessEntityId))
                {
                    return NotFound();
                }

                var dealer = Mapper.Map<Dealer>(dealerDto);
                if (_dealerRepository.DealerExists(dealer))
                {
                    return StatusCode(500, "Dealer already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedDealer = _dealerRepository.UpdateDealer(businessEntityId, dealer, profile.UserProfileId);

                if (updatedDealer == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedDealerToReturn = Mapper.Map<DealerDto>(updatedDealer);
                return Created(updatedDealerToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /Dealers(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/Dealers({businessEntityId})")]
        public IActionResult Patch([FromODataUri] int businessEntityId, [FromBody]Delta<DealerDto> dealerDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_dealerRepository.DealerExists(businessEntityId))
                {
                    return NotFound();
                }

                var dealerToPatch = Mapper.Map<Delta<Dealer>>(dealerDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(dealerToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_dealerRepository.PartialUpdateDealer(businessEntityId, dealerToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /Dealers(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/Dealers({businessEntityId})")]
        public IActionResult Delete([FromODataUri] int businessEntityId)
        {
            try
            {
                if (!_dealerRepository.DealerExists(businessEntityId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_dealerRepository.DeleteDealer(businessEntityId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /Dealers(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
