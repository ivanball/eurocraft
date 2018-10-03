using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class AddressTypeRepository : IAddressTypeRepository
    {
        private AuditableContext _ctx;
        private ILogger<AddressTypeRepository> _logger;

        public AddressTypeRepository(AuditableContext ctx, ILogger<AddressTypeRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool AddressTypeExists(int addressTypeId)
        {
            try
            {
                return _ctx.AddressTypes.Any(c => c.AddressTypeId == addressTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in AddressTypeExists: {ex}");
                return false;
            }
        }

        public bool AddressTypeExists(AddressType addressType)
        {
            try
            {
                return _ctx.AddressTypes.Any(c => c.AddressTypeName == addressType.AddressTypeName && c.AddressTypeId != addressType.AddressTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in AddressTypeExists: {ex}");
                return false;
            }
        }

        public IEnumerable<AddressType> GetAddressTypes()
        {
            try
            {
                IEnumerable<AddressType> addressTypes = _ctx.AddressTypes
                    .OrderBy(c => c.AddressTypeName).ToList();
                return addressTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetAddressTypes: {ex}");
                return null;
            }
        }

        public AddressType GetAddressType(int addressTypeId, string propertyToInclude = null)
        {
            try
            {
                AddressType addressType = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    addressType = _ctx.AddressTypes.Include(propertyToInclude)
                        .Where(c => c.AddressTypeId == addressTypeId)
                        .FirstOrDefault();
                }
                addressType = _ctx.AddressTypes
                    .Where(c => c.AddressTypeId == addressTypeId).FirstOrDefault();

                return addressType;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetAddressType: {ex}");
                return null;
            }
        }

        public AddressType CreateAddressType(AddressType addressType, int userId = -1)
        {
            try
            {
                var addressTypeEntityEntry = _ctx.AddressTypes.Add(addressType);

                if (!Save(userId)) return null;
                return addressTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateAddressType: {ex}");
                return null;
            }
        }

        public AddressType UpdateAddressType(int addressTypeId, AddressType addressType, int userId = -1)
        {
            try
            {
                var existingAddressType = GetAddressType(addressTypeId);
                _ctx.Entry(existingAddressType).CurrentValues.SetValues(addressType);
                _ctx.Entry(existingAddressType).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingAddressType).Property(x => x.AdmCreatedBy).IsModified = false;
                var addressTypeEntityEntry = _ctx.Entry(existingAddressType);

                if (!Save(userId)) return null;
                return addressTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateAddressType: {ex}");
                return null;
            }
        }

        public bool PartialUpdateAddressType(int addressTypeId, Delta<AddressType> addressTypeDelta, int userId = -1)
        {
            try
            {
                var existingAddressType = GetAddressType(addressTypeId);

                addressTypeDelta.Patch(existingAddressType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateAddressType: {ex}");
                return false;
            }
        }

        public bool DeleteAddressType(int addressTypeId, int userId = -1)
        {
            try
            {
                var existingAddressType = GetAddressType(addressTypeId);
                if (existingAddressType == null)
                {
                    return false;
                }

                _ctx.AddressTypes.Remove(existingAddressType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteAddressType: {ex}");
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
