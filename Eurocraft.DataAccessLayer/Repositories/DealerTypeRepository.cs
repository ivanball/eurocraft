using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class DealerTypeRepository : IDealerTypeRepository
    {
        private AuditableContext _ctx;
        private ILogger<DealerTypeRepository> _logger;

        public DealerTypeRepository(AuditableContext ctx, ILogger<DealerTypeRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool DealerTypeExists(int dealerTypeId)
        {
            try
            {
                return _ctx.DealerTypes.Any(c => c.DealerTypeId == dealerTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DealerTypeExists: {ex}");
                return false;
            }
        }

        public bool DealerTypeExists(DealerType dealerType)
        {
            try
            {
                return _ctx.DealerTypes.Any(c => c.DealerTypeName == dealerType.DealerTypeName && c.DealerTypeId != dealerType.DealerTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DealerTypeExists: {ex}");
                return false;
            }
        }

        public IEnumerable<DealerType> GetDealerTypes()
        {
            try
            {
                IEnumerable<DealerType> dealerTypes = _ctx.DealerTypes
                    .OrderBy(c => c.DealerTypeName).ToList();
                return dealerTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetDealerTypes: {ex}");
                return null;
            }
        }

        public DealerType GetDealerType(int dealerTypeId, string propertyToInclude = null)
        {
            try
            {
                DealerType dealerType = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    dealerType = _ctx.DealerTypes.Include(propertyToInclude)
                        .Where(c => c.DealerTypeId == dealerTypeId)
                        .FirstOrDefault();
                }
                dealerType = _ctx.DealerTypes
                    .Where(c => c.DealerTypeId == dealerTypeId).FirstOrDefault();

                return dealerType;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetDealerType: {ex}");
                return null;
            }
        }

        public DealerType CreateDealerType(DealerType dealerType, int userId = -1)
        {
            try
            {
                var dealerTypeEntityEntry = _ctx.DealerTypes.Add(dealerType);

                if (!Save(userId)) return null;
                return dealerTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateDealerType: {ex}");
                return null;
            }
        }

        public DealerType UpdateDealerType(int dealerTypeId, DealerType dealerType, int userId = -1)
        {
            try
            {
                var existingDealerType = GetDealerType(dealerTypeId);
                _ctx.Entry(existingDealerType).CurrentValues.SetValues(dealerType);
                _ctx.Entry(existingDealerType).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingDealerType).Property(x => x.AdmCreatedBy).IsModified = false;
                var dealerTypeEntityEntry = _ctx.Entry(existingDealerType);

                if (!Save(userId)) return null;
                return dealerTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateDealerType: {ex}");
                return null;
            }
        }

        public bool PartialUpdateDealerType(int dealerTypeId, Delta<DealerType> dealerTypeDelta, int userId = -1)
        {
            try
            {
                var existingDealerType = GetDealerType(dealerTypeId);

                dealerTypeDelta.Patch(existingDealerType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateDealerType: {ex}");
                return false;
            }
        }

        public bool DeleteDealerType(int dealerTypeId, int userId = -1)
        {
            try
            {
                var existingDealerType = GetDealerType(dealerTypeId);
                if (existingDealerType == null)
                {
                    return false;
                }

                _ctx.DealerTypes.Remove(existingDealerType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteDealerType: {ex}");
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
