using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class VendorRepository : IVendorRepository
    {
        private AuditableContext _ctx;
        private ILogger<VendorRepository> _logger;

        public VendorRepository(AuditableContext ctx, ILogger<VendorRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool VendorExists(int businessEntityId)
        {
            try
            {
                return _ctx.Vendors.Any(c => c.BusinessEntityId == businessEntityId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in VendorExists: {ex}");
                return false;
            }
        }

        public bool VendorExists(Vendor vendor)
        {
            try
            {
                return _ctx.Vendors.Any(c => c.VendorName == vendor.VendorName && c.BusinessEntityId != vendor.BusinessEntityId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in VendorExists: {ex}");
                return false;
            }
        }

        public IEnumerable<Vendor> GetVendors()
        {
            try
            {
                IEnumerable<Vendor> vendors = _ctx.Vendors
                    .Include(v => v.BusinessEntity.BusinessEntityAddresses).ThenInclude(bea => bea.Address)
                    .Include(v => v.BusinessEntity.BusinessEntityContacts).ThenInclude(bec => bec.Person)
                    .Include(v => v.BusinessEntity.BusinessEntityEmails)
                    .Include(v => v.BusinessEntity.BusinessEntityPhones)
                    .OrderBy(c => c.VendorName).ToList();
                return vendors;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetVendors: {ex}");
                return null;
            }
        }

        public Vendor GetVendor(int businessEntityId, string propertyToInclude = null)
        {
            try
            {
                Vendor vendor = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    vendor = _ctx.Vendors.Include(propertyToInclude)
                        .Where(c => c.BusinessEntityId == businessEntityId)
                        .FirstOrDefault();
                }
                vendor = _ctx.Vendors
                    .Include(v => v.BusinessEntity.BusinessEntityAddresses).ThenInclude(bea => bea.Address)
                    .Include(v => v.BusinessEntity.BusinessEntityContacts).ThenInclude(bec => bec.Person)
                    .Include(v => v.BusinessEntity.BusinessEntityEmails)
                    .Include(v => v.BusinessEntity.BusinessEntityPhones)
                    .Where(c => c.BusinessEntityId == businessEntityId).FirstOrDefault();

                return vendor;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetVendor: {ex}");
                return null;
            }
        }

        public BusinessEntityAddress GetBusinessEntityAddress(int businessEntityAddressId)
        {
            try
            {
                return _ctx.BusinessEntityAddresses
                    .Include(bea => bea.Address)
                    .Where(c => c.BusinessEntityAddressId == businessEntityAddressId).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBusinessEntityAddress: {ex}");
                return null;
            }
        }

        public BusinessEntityContact GetBusinessEntityContact(int businessEntityContactId)
        {
            try
            {
                return _ctx.BusinessEntityContacts
                    .Include(bec => bec.Person)
                    .Where(c => c.BusinessEntityContactId == businessEntityContactId).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBusinessEntityContact: {ex}");
                return null;
            }
        }

        public BusinessEntityEmail GetBusinessEntityEmail(int businessEntityEmailId)
        {
            try
            {
                return _ctx.BusinessEntityEmails.Where(c => c.BusinessEntityEmailId == businessEntityEmailId).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBusinessEntityEmail: {ex}");
                return null;
            }
        }

        public BusinessEntityPhone GetBusinessEntityPhone(int businessEntityPhoneId)
        {
            try
            {
                return _ctx.BusinessEntityPhones.Where(c => c.BusinessEntityPhoneId == businessEntityPhoneId).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBusinessEntityPhone: {ex}");
                return null;
            }
        }

        public Vendor CreateVendor(Vendor vendor, int userId = -1)
        {
            try
            {
                var vendorEntityEntry = _ctx.Vendors.Add(vendor);

                if (!Save(userId)) return null;
                return vendorEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateVendor: {ex}");
                return null;
            }
        }

        public Vendor UpdateVendor(int businessEntityId, Vendor vendor, int userId = -1)
        {
            try
            {
                var existingVendor = GetVendor(businessEntityId);
                _ctx.Entry(existingVendor).CurrentValues.SetValues(vendor);
                _ctx.Entry(existingVendor).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingVendor).Property(x => x.AdmCreatedBy).IsModified = false;

                var vendorEntityEntry = _ctx.Entry(existingVendor);

                // Delete children
                foreach (var businessEntityAddress in existingVendor.BusinessEntity.BusinessEntityAddresses)
                {
                    if (!vendor.BusinessEntity.BusinessEntityAddresses.Any(c => c.BusinessEntityAddressId == businessEntityAddress.BusinessEntityAddressId))
                    {
                        _ctx.BusinessEntityAddresses.Remove(businessEntityAddress);
                        _ctx.Addresses.Remove(businessEntityAddress.Address);
                    }
                }
                foreach (var businessEntityAddress in vendor.BusinessEntity.BusinessEntityAddresses)
                {
                    var existingBusinessEntityAddress = GetBusinessEntityAddress(businessEntityAddress.BusinessEntityAddressId);
                    if (existingBusinessEntityAddress == null)
                    {
                        businessEntityAddress.BusinessEntityId = businessEntityId;
                        _ctx.BusinessEntityAddresses.Add(businessEntityAddress);
                        _ctx.Addresses.Add(businessEntityAddress.Address);
                    }
                    else
                    {
                        _ctx.Entry(existingBusinessEntityAddress).CurrentValues.SetValues(businessEntityAddress);
                        _ctx.Entry(existingBusinessEntityAddress).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityAddress).Property(x => x.AdmCreatedBy).IsModified = false;
                        _ctx.Entry(existingBusinessEntityAddress.Address).CurrentValues.SetValues(businessEntityAddress.Address);
                        _ctx.Entry(existingBusinessEntityAddress.Address).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityAddress.Address).Property(x => x.AdmCreatedBy).IsModified = false;
                    }
                }

                // Delete children
                foreach (var businessEntityContact in existingVendor.BusinessEntity.BusinessEntityContacts)
                {
                    if (!vendor.BusinessEntity.BusinessEntityContacts.Any(c => c.BusinessEntityContactId == businessEntityContact.BusinessEntityContactId))
                    {
                        _ctx.BusinessEntityContacts.Remove(businessEntityContact);
                        _ctx.Persons.Remove(businessEntityContact.Person);
                    }
                }
                foreach (var businessEntityContact in vendor.BusinessEntity.BusinessEntityContacts)
                {
                    var existingBusinessEntityContact = GetBusinessEntityContact(businessEntityContact.BusinessEntityContactId);
                    if (existingBusinessEntityContact == null)
                    {
                        businessEntityContact.BusinessEntityId = businessEntityId;
                        _ctx.BusinessEntityContacts.Add(businessEntityContact);
                        _ctx.Persons.Add(businessEntityContact.Person);
                    }
                    else
                    {
                        _ctx.Entry(existingBusinessEntityContact).CurrentValues.SetValues(businessEntityContact);
                        _ctx.Entry(existingBusinessEntityContact).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityContact).Property(x => x.AdmCreatedBy).IsModified = false;
                        _ctx.Entry(existingBusinessEntityContact.Person).CurrentValues.SetValues(businessEntityContact.Person);
                        _ctx.Entry(existingBusinessEntityContact.Person).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityContact.Person).Property(x => x.AdmCreatedBy).IsModified = false;
                    }
                }

                // Delete children
                foreach (var businessEntityEmail in existingVendor.BusinessEntity.BusinessEntityEmails)
                {
                    if (!vendor.BusinessEntity.BusinessEntityEmails.Any(c => c.BusinessEntityEmailId == businessEntityEmail.BusinessEntityEmailId))
                        _ctx.BusinessEntityEmails.Remove(businessEntityEmail);
                }
                foreach (var businessEntityEmail in vendor.BusinessEntity.BusinessEntityEmails)
                {
                    var existingBusinessEntityEmail = GetBusinessEntityEmail(businessEntityEmail.BusinessEntityEmailId);
                    if (existingBusinessEntityEmail == null)
                    {
                        businessEntityEmail.BusinessEntityId = businessEntityId;
                        _ctx.BusinessEntityEmails.Add(businessEntityEmail);
                    }
                    else
                    {
                        _ctx.Entry(existingBusinessEntityEmail).CurrentValues.SetValues(businessEntityEmail);
                        _ctx.Entry(existingBusinessEntityEmail).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityEmail).Property(x => x.AdmCreatedBy).IsModified = false;
                    }
                }

                // Delete children
                foreach (var businessEntityPhone in existingVendor.BusinessEntity.BusinessEntityPhones)
                {
                    if (!vendor.BusinessEntity.BusinessEntityPhones.Any(c => c.BusinessEntityPhoneId == businessEntityPhone.BusinessEntityPhoneId))
                        _ctx.BusinessEntityPhones.Remove(businessEntityPhone);
                }
                foreach (var businessEntityPhone in vendor.BusinessEntity.BusinessEntityPhones)
                {
                    var existingBusinessEntityPhone = GetBusinessEntityPhone(businessEntityPhone.BusinessEntityPhoneId);
                    if (existingBusinessEntityPhone == null)
                    {
                        businessEntityPhone.BusinessEntityId = businessEntityId;
                        _ctx.BusinessEntityPhones.Add(businessEntityPhone);
                    }
                    else
                    {
                        _ctx.Entry(existingBusinessEntityPhone).CurrentValues.SetValues(businessEntityPhone);
                        _ctx.Entry(existingBusinessEntityPhone).Property(x => x.AdmCreated).IsModified = false;
                        _ctx.Entry(existingBusinessEntityPhone).Property(x => x.AdmCreatedBy).IsModified = false;
                    }
                }

                if (!Save(userId)) return null;
                return vendorEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateVendor: {ex}");
                return null;
            }
        }

        public bool PartialUpdateVendor(int businessEntityId, Delta<Vendor> vendorDelta, int userId = -1)
        {
            try
            {
                var existingVendor = GetVendor(businessEntityId);

                vendorDelta.Patch(existingVendor);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateVendor: {ex}");
                return false;
            }
        }

        public bool DeleteVendor(int businessEntityId, int userId = -1)
        {
            try
            {
                var existingBusinessEntity = _ctx.BusinessEntities.FirstOrDefault(c => c.BusinessEntityId == businessEntityId);
                if (existingBusinessEntity == null)
                {
                    return false;
                }
                var existingVendor = GetVendor(businessEntityId);

                //_ctx.BusinessEntities.Remove(existingBusinessEntity);
                _ctx.Vendors.Remove(existingVendor);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteVendor: {ex}");
                return false;
            }
        }

        public bool Save(int userId)
        {
            try
            {
                return (_ctx.SaveChanges(userId) >= 0);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Save: {ex}");
                return false;
            }
        }
    }
}
