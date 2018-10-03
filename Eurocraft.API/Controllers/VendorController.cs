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
    public class VendorController : ODataController
    {
        private IAccountRepository _accountRepository;
        private IVendorRepository _vendorRepository;
        private ILogger<VendorRepository> _logger;

        public VendorController(IAccountRepository accountRepository, IVendorRepository vendorRepository, ILogger<VendorRepository> logger)
        {
            _accountRepository = accountRepository;
            _vendorRepository = vendorRepository;
            _logger = logger;
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Vendors")]
        public IActionResult Get()
        {
            try
            {
                var vendors = _vendorRepository.GetVendors();
                var results = Mapper.Map<IEnumerable<VendorDto>>(vendors);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Vendors: {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Vendors({businessEntityId})")]
        public IActionResult Get([FromODataUri] int businessEntityId)
        {
            try
            {
                var vendor = _vendorRepository.GetVendor(businessEntityId);
                if (vendor == null)
                {
                    return NotFound();
                }

                var result = Mapper.Map<VendorDto>(vendor);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Vendors(businessEntityId): {ex}");
                return BadRequest();
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("Vendors({businessEntityId})/VendorName")]
        [ODataRoute("Vendors({businessEntityId})/VendorName/$value")]
        public IActionResult GetVendorProperty([FromODataUri] int businessEntityId, [FromODataUri] string property)
        {
            try
            {
                var vendor = _vendorRepository.GetVendor(businessEntityId);
                if (vendor == null)
                {
                    return NotFound();
                }

                var uriArray = Request.Path.Value.Split('/');
                var propertyToGet = uriArray[uriArray.Length - 1];
                bool getRawValue = (propertyToGet == "$value");
                if (getRawValue) propertyToGet = uriArray[uriArray.Length - 2];

                var isCollectionProperty = vendor.IsCollectionProperty(propertyToGet);
                if (isCollectionProperty)
                {
                    vendor = _vendorRepository.GetVendor(businessEntityId, propertyToGet);
                }

                if (!vendor.HasProperty(propertyToGet))
                {
                    return NotFound();
                }

                var propertyValue = vendor.GetValue(propertyToGet);
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
                _logger.LogError($"Failed in GetVendorProperty /Vendors(businessEntityId)/property: {ex}");
                return BadRequest();
            }
        }
/*
        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Vendors({businessEntityId})/EmailAddresses")]
        public IActionResult GetEmailAddresses([FromODataUri] int businessEntityId)
        {
            try
            {
                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    _logger.LogInformation($"Vendor with id {businessEntityId} wasn't found when accesing Email Addresses.");
                    return NotFound();
                }
                var emailAddressesForVendor = _vendorRepository.GetEmailAddressesForVendor(businessEntityId);
                var emailAddressesForVendorResults = Mapper.Map<IEnumerable<BusinessEntityEmailDto>>(emailAddressesForVendor);
                return Ok(emailAddressesForVendorResults);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Vendors(businessEntityId)/EmailAddresses: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpGet]
        [EnableQuery]
        [ODataRoute("/Vendors({businessEntityId})/EmailAddresses({emailAddressId})")]
        public IActionResult GetEmailAddress([FromODataUri] int businessEntityId, [FromODataUri] int emailAddressId)
        {
            try
            {
                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    _logger.LogInformation($"Vendor with id {businessEntityId} wasn't found when accesing GetEmailAddress.");
                    return NotFound();
                }

                var businessEntityEmail = _vendorRepository.GetEmailAddressForVendor(businessEntityId, emailAddressId);
                if (businessEntityEmail == null)
                {
                    return NotFound();
                }

                var businessEntityEmailResult = Mapper.Map<BusinessEntityEmailDto>(businessEntityEmail);
                return Ok(businessEntityEmailResult);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Vendors(businessEntityId)/EmailAddresses(emailAddressId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPost]
        [ODataRoute("/Vendors({businessEntityId})/EmailAddresses")]
        public IActionResult CreateEmailAddress([FromODataUri] int businessEntityId, [FromBody]BusinessEntityEmailDto businessEntityEmail)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    _logger.LogInformation($"Vendor with id {businessEntityId} wasn't found when creating CreateEmailAddress.");
                    return NotFound();
                }

                var finalEmailAddress = Mapper.Map<BusinessEntityEmail>(businessEntityEmail);

                if (!_vendorRepository.CreateEmailAddressForVendor(businessEntityId, finalEmailAddress))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdEmailAddressToReturn = Mapper.Map<BusinessEntityEmailDto>(finalEmailAddress);

                return Created(createdEmailAddressToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /Vendors(businessEntityId)/EmailAddresses: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
*/
        [HttpPost]
        [ODataRoute("/Vendors")]
        public IActionResult Post([FromBody]VendorDto vendorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var vendor = Mapper.Map<Vendor>(vendorDto);
                if (_vendorRepository.VendorExists(vendor))
                {
                    return StatusCode(500, "Vendor already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var createdVendor = _vendorRepository.CreateVendor(vendor, profile.UserProfileId);

                if (createdVendor == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var createdVendorToReturn = Mapper.Map<VendorDto>(createdVendor);
                return Created(createdVendorToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Post /Vendors: {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPut]
        [ODataRoute("/Vendors({businessEntityId})")]
        public IActionResult Put([FromODataUri] int businessEntityId, [FromBody]VendorDto vendorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    return NotFound();
                }

                var vendor = Mapper.Map<Vendor>(vendorDto);
                if (_vendorRepository.VendorExists(vendor))
                {
                    return StatusCode(500, "Vendor already exists.");
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                var updatedVendor = _vendorRepository.UpdateVendor(businessEntityId, vendor, profile.UserProfileId);

                if (updatedVendor == null)
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                var updatedVendorToReturn = Mapper.Map<VendorDto>(updatedVendor);
                return Created(updatedVendorToReturn);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Put /Vendors(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpPatch]
        [ODataRoute("/Vendors({businessEntityId})")]
        public IActionResult Patch([FromODataUri] int businessEntityId, [FromBody]Delta<VendorDto> vendorDelta)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    return NotFound();
                }

                var vendorToPatch = Mapper.Map<Delta<Vendor>>(vendorDelta);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                if (!TryValidateModel(vendorToPatch))
                {
                    return BadRequest();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_vendorRepository.PartialUpdateVendor(businessEntityId, vendorToPatch, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Patch /Vendors(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }

        [HttpDelete]
        [ODataRoute("/Vendors({businessEntityId})")]
        public IActionResult Delete([FromODataUri] int businessEntityId)
        {
            try
            {
                if (!_vendorRepository.VendorExists(businessEntityId))
                {
                    return NotFound();
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (!_vendorRepository.DeleteVendor(businessEntityId, profile.UserProfileId))
                {
                    return StatusCode(500, "A problem happened while handling your request.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Delete /Vendors(businessEntityId): {ex}");
                return StatusCode(500, "A problem happened while handling your request.");
            }
        }
    }
}
