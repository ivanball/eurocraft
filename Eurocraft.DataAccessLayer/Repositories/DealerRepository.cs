using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class DealerRepository : IDealerRepository
    {
        private AuditableContext _ctx;
        private ILogger<DealerRepository> _logger;

        public DealerRepository(AuditableContext ctx, ILogger<DealerRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool DealerExists(int businessEntityId)
        {
            try
            {
                return _ctx.Dealers.Any(c => c.BusinessEntityId == businessEntityId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DealerExists: {ex}");
                return false;
            }
        }

        public bool DealerExists(Dealer dealer)
        {
            try
            {
                return _ctx.Dealers.Any(c => c.DealerName == dealer.DealerName && c.BusinessEntityId != dealer.BusinessEntityId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DealerExists: {ex}");
                return false;
            }
        }

        public IEnumerable<Dealer> GetDealers()
        {
            try
            {
                IEnumerable<Dealer> dealers = _ctx.Dealers
                    .Include(v => v.DealerType)
                    .Include(v => v.BusinessEntity.BusinessEntityAddresses).ThenInclude(bea => bea.Address)
                    .Include(v => v.BusinessEntity.BusinessEntityContacts).ThenInclude(bec => bec.Person)
                    .Include(v => v.BusinessEntity.BusinessEntityEmails)
                    .Include(v => v.BusinessEntity.BusinessEntityPhones)
                    .OrderBy(c => c.DealerName).ToList();
                return dealers;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetDealers: {ex}");
                return null;
            }
        }

        public Dealer GetDealer(int businessEntityId, string propertyToInclude = null)
        {
            try
            {
                Dealer dealer = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    dealer = _ctx.Dealers.Include(propertyToInclude)
                        .Where(c => c.BusinessEntityId == businessEntityId)
                        .FirstOrDefault();
                }
                dealer = _ctx.Dealers
                    .Include(v => v.DealerType)
                    .Include(v => v.BusinessEntity.BusinessEntityAddresses).ThenInclude(bea => bea.Address)
                    .Include(v => v.BusinessEntity.BusinessEntityContacts).ThenInclude(bec => bec.Person)
                    .Include(v => v.BusinessEntity.BusinessEntityEmails)
                    .Include(v => v.BusinessEntity.BusinessEntityPhones)
                    .Where(c => c.BusinessEntityId == businessEntityId).FirstOrDefault();

                return dealer;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetDealer: {ex}");
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

        public Dealer CreateDealer(Dealer dealer, int userId = -1)
        {
            try
            {
                var dealerEntityEntry = _ctx.Dealers.Add(dealer);

                if (!Save(userId)) return null;
                return dealerEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateDealer: {ex}");
                return null;
            }
        }

        public Dealer UpdateDealer(int businessEntityId, Dealer dealer, int userId = -1)
        {
            try
            {
                var existingDealer = GetDealer(businessEntityId);
                _ctx.Entry(existingDealer).CurrentValues.SetValues(dealer);
                _ctx.Entry(existingDealer).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingDealer).Property(x => x.AdmCreatedBy).IsModified = false;

                var dealerEntityEntry = _ctx.Entry(existingDealer);

                // Delete children
                foreach (var businessEntityAddress in existingDealer.BusinessEntity.BusinessEntityAddresses)
                {
                    if (!dealer.BusinessEntity.BusinessEntityAddresses.Any(c => c.BusinessEntityAddressId == businessEntityAddress.BusinessEntityAddressId))
                    {
                        _ctx.BusinessEntityAddresses.Remove(businessEntityAddress);
                        _ctx.Addresses.Remove(businessEntityAddress.Address);
                    }
                }
                foreach (var businessEntityAddress in dealer.BusinessEntity.BusinessEntityAddresses)
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
                foreach (var businessEntityContact in existingDealer.BusinessEntity.BusinessEntityContacts)
                {
                    if (!dealer.BusinessEntity.BusinessEntityContacts.Any(c => c.BusinessEntityContactId == businessEntityContact.BusinessEntityContactId))
                    {
                        _ctx.BusinessEntityContacts.Remove(businessEntityContact);
                        _ctx.Persons.Remove(businessEntityContact.Person);
                    }
                }
                foreach (var businessEntityContact in dealer.BusinessEntity.BusinessEntityContacts)
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
                foreach (var businessEntityEmail in existingDealer.BusinessEntity.BusinessEntityEmails)
                {
                    if (!dealer.BusinessEntity.BusinessEntityEmails.Any(c => c.BusinessEntityEmailId == businessEntityEmail.BusinessEntityEmailId))
                        _ctx.BusinessEntityEmails.Remove(businessEntityEmail);
                }
                foreach (var businessEntityEmail in dealer.BusinessEntity.BusinessEntityEmails)
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
                foreach (var businessEntityPhone in existingDealer.BusinessEntity.BusinessEntityPhones)
                {
                    if (!dealer.BusinessEntity.BusinessEntityPhones.Any(c => c.BusinessEntityPhoneId == businessEntityPhone.BusinessEntityPhoneId))
                        _ctx.BusinessEntityPhones.Remove(businessEntityPhone);
                }
                foreach (var businessEntityPhone in dealer.BusinessEntity.BusinessEntityPhones)
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
                return dealerEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateDealer: {ex}");
                return null;
            }
        }

        public bool PartialUpdateDealer(int businessEntityId, Delta<Dealer> dealerDelta, int userId = -1)
        {
            try
            {
                var existingDealer = GetDealer(businessEntityId);

                dealerDelta.Patch(existingDealer);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateDealer: {ex}");
                return false;
            }
        }

        public bool DeleteDealer(int businessEntityId, int userId = -1)
        {
            try
            {
                var existingBusinessEntity = _ctx.BusinessEntities.FirstOrDefault(c => c.BusinessEntityId == businessEntityId);
                if (existingBusinessEntity == null)
                {
                    return false;
                }
                var existingDealer = GetDealer(businessEntityId);

                //_ctx.BusinessEntities.Remove(existingBusinessEntity);
                _ctx.Dealers.Remove(existingDealer);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteDealer: {ex}");
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
