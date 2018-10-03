using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class StateProvinceRepository : IStateProvinceRepository
    {
        private AuditableContext _ctx;
        private ILogger<StateProvinceRepository> _logger;

        public StateProvinceRepository(AuditableContext ctx, ILogger<StateProvinceRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool StateProvinceExists(int stateProvinceId)
        {
            try
            {
                return _ctx.StateProvinces.Any(c => c.StateProvinceId == stateProvinceId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in StateProvinceExists: {ex}");
                return false;
            }
        }

        public bool StateProvinceExists(StateProvince stateProvince)
        {
            try
            {
                return _ctx.StateProvinces.Any(c => 
                    c.StateProvinceName == stateProvince.StateProvinceName &&
                    c.CountryRegionId == stateProvince.CountryRegionId &&
                    c.StateProvinceId != stateProvince.StateProvinceId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in StateProvinceExists: {ex}");
                return false;
            }
        }

        public IEnumerable<StateProvince> GetStateProvinces()
        {
            try
            {
                IEnumerable<StateProvince> StateProvinces = _ctx.StateProvinces
                    .Include(v => v.CountryRegion)
                    .OrderBy(c => c.StateProvinceName).ToList();
                return StateProvinces;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetStateProvinces: {ex}");
                return null;
            }
        }

        public StateProvince GetStateProvince(int stateProvinceId, string propertyToInclude = null)
        {
            try
            {
                StateProvince StateProvince = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    StateProvince = _ctx.StateProvinces.Include(propertyToInclude)
                        .Where(c => c.StateProvinceId == stateProvinceId)
                        .FirstOrDefault();
                }
                StateProvince = _ctx.StateProvinces
                    .Include(v => v.CountryRegion)
                    .Where(c => c.StateProvinceId == stateProvinceId).FirstOrDefault();

                return StateProvince;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetStateProvince: {ex}");
                return null;
            }
        }

        public StateProvince CreateStateProvince(StateProvince stateProvince, int userId = -1)
        {
            try
            {
                var StateProvinceEntityEntry = _ctx.StateProvinces.Add(stateProvince);

                if (!Save(userId)) return null;
                return StateProvinceEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateStateProvince: {ex}");
                return null;
            }
        }

        public StateProvince UpdateStateProvince(int stateProvinceId, StateProvince StateProvince, int userId = -1)
        {
            try
            {
                var existingStateProvince = GetStateProvince(stateProvinceId);
                _ctx.Entry(existingStateProvince).CurrentValues.SetValues(StateProvince);
                _ctx.Entry(existingStateProvince).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingStateProvince).Property(x => x.AdmCreatedBy).IsModified = false;
                var StateProvinceEntityEntry = _ctx.Entry(existingStateProvince);

                if (!Save(userId)) return null;
                return StateProvinceEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateStateProvince: {ex}");
                return null;
            }
        }

        public bool PartialUpdateStateProvince(int stateProvinceId, Delta<StateProvince> stateProvinceDelta, int userId = -1)
        {
            try
            {
                var existingStateProvince = GetStateProvince(stateProvinceId);

                stateProvinceDelta.Patch(existingStateProvince);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateStateProvince: {ex}");
                return false;
            }
        }

        public bool DeleteStateProvince(int stateProvinceId, int userId = -1)
        {
            try
            {
                var existingStateProvince = GetStateProvince(stateProvinceId);
                if (existingStateProvince == null)
                {
                    return false;
                }

                _ctx.StateProvinces.Remove(existingStateProvince);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteStateProvince: {ex}");
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
