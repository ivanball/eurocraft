using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class PhoneNumberTypeRepository : IPhoneNumberTypeRepository
    {
        private AuditableContext _ctx;
        private ILogger<PhoneNumberTypeRepository> _logger;

        public PhoneNumberTypeRepository(AuditableContext ctx, ILogger<PhoneNumberTypeRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool PhoneNumberTypeExists(int phoneNumberTypeId)
        {
            try
            {
                return _ctx.PhoneNumberTypes.Any(c => c.PhoneNumberTypeId == phoneNumberTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PhoneNumberTypeExists: {ex}");
                return false;
            }
        }

        public bool PhoneNumberTypeExists(PhoneNumberType phoneNumberType)
        {
            try
            {
                return _ctx.PhoneNumberTypes.Any(c => c.PhoneNumberTypeName == phoneNumberType.PhoneNumberTypeName && c.PhoneNumberTypeId != phoneNumberType.PhoneNumberTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PhoneNumberTypeExists: {ex}");
                return false;
            }
        }

        public IEnumerable<PhoneNumberType> GetPhoneNumberTypes()
        {
            try
            {
                IEnumerable<PhoneNumberType> phoneNumberTypes = _ctx.PhoneNumberTypes
                    .OrderBy(c => c.PhoneNumberTypeName).ToList();
                return phoneNumberTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetPhoneNumberTypes: {ex}");
                return null;
            }
        }

        public PhoneNumberType GetPhoneNumberType(int phoneNumberTypeId, string propertyToInclude = null)
        {
            try
            {
                PhoneNumberType phoneNumberType = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    phoneNumberType = _ctx.PhoneNumberTypes.Include(propertyToInclude)
                        .Where(c => c.PhoneNumberTypeId == phoneNumberTypeId)
                        .FirstOrDefault();
                }
                phoneNumberType = _ctx.PhoneNumberTypes
                    .Where(c => c.PhoneNumberTypeId == phoneNumberTypeId).FirstOrDefault();

                return phoneNumberType;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetPhoneNumberType: {ex}");
                return null;
            }
        }

        public PhoneNumberType CreatePhoneNumberType(PhoneNumberType phoneNumberType, int userId = -1)
        {
            try
            {
                var phoneNumberTypeEntityEntry = _ctx.PhoneNumberTypes.Add(phoneNumberType);

                if (!Save(userId)) return null;
                return phoneNumberTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreatePhoneNumberType: {ex}");
                return null;
            }
        }

        public PhoneNumberType UpdatePhoneNumberType(int phoneNumberTypeId, PhoneNumberType phoneNumberType, int userId = -1)
        {
            try
            {
                var existingPhoneNumberType = GetPhoneNumberType(phoneNumberTypeId);
                _ctx.Entry(existingPhoneNumberType).CurrentValues.SetValues(phoneNumberType);
                _ctx.Entry(existingPhoneNumberType).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingPhoneNumberType).Property(x => x.AdmCreatedBy).IsModified = false;
                var phoneNumberTypeEntityEntry = _ctx.Entry(existingPhoneNumberType);

                if (!Save(userId)) return null;
                return phoneNumberTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdatePhoneNumberType: {ex}");
                return null;
            }
        }

        public bool PartialUpdatePhoneNumberType(int phoneNumberTypeId, Delta<PhoneNumberType> phoneNumberTypeDelta, int userId = -1)
        {
            try
            {
                var existingPhoneNumberType = GetPhoneNumberType(phoneNumberTypeId);

                phoneNumberTypeDelta.Patch(existingPhoneNumberType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdatePhoneNumberType: {ex}");
                return false;
            }
        }

        public bool DeletePhoneNumberType(int phoneNumberTypeId, int userId = -1)
        {
            try
            {
                var existingPhoneNumberType = GetPhoneNumberType(phoneNumberTypeId);
                if (existingPhoneNumberType == null)
                {
                    return false;
                }

                _ctx.PhoneNumberTypes.Remove(existingPhoneNumberType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeletePhoneNumberType: {ex}");
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
