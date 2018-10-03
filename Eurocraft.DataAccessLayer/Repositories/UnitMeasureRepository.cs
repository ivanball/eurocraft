using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class UnitMeasureRepository : IUnitMeasureRepository
    {
        private AuditableContext _ctx;
        private ILogger<UnitMeasureRepository> _logger;

        public UnitMeasureRepository(AuditableContext ctx, ILogger<UnitMeasureRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool UnitMeasureExists(int unitMeasureId)
        {
            try
            {
                return _ctx.UnitMeasures.Any(c => c.UnitMeasureId == unitMeasureId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UnitMeasureExists: {ex}");
                return false;
            }
        }

        public bool UnitMeasureExists(UnitMeasure unitMeasure)
        {
            try
            {
                return _ctx.UnitMeasures.Any(c => c.UnitMeasureName == unitMeasure.UnitMeasureName && c.UnitMeasureId != unitMeasure.UnitMeasureId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UnitMeasureExists: {ex}");
                return false;
            }
        }

        public IEnumerable<UnitMeasure> GetUnitMeasures()
        {
            try
            {
                IEnumerable<UnitMeasure> unitMeasures = _ctx.UnitMeasures
                    .OrderBy(c => c.UnitMeasureName).ToList();
                return unitMeasures;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetUnitMeasures: {ex}");
                return null;
            }
        }

        public UnitMeasure GetUnitMeasure(int unitMeasureId, string propertyToInclude = null)
        {
            try
            {
                UnitMeasure unitMeasure = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    unitMeasure = _ctx.UnitMeasures.Include(propertyToInclude)
                        .Where(c => c.UnitMeasureId == unitMeasureId)
                        .FirstOrDefault();
                }
                unitMeasure = _ctx.UnitMeasures
                    .Where(c => c.UnitMeasureId == unitMeasureId).FirstOrDefault();

                return unitMeasure;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetUnitMeasure: {ex}");
                return null;
            }
        }

        public UnitMeasure CreateUnitMeasure(UnitMeasure unitMeasure, int userId = -1)
        {
            try
            {
                var unitMeasureEntityEntry = _ctx.UnitMeasures.Add(unitMeasure);

                if (!Save(userId)) return null;
                return unitMeasureEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateUnitMeasure: {ex}");
                return null;
            }
        }

        public UnitMeasure UpdateUnitMeasure(int unitMeasureId, UnitMeasure unitMeasure, int userId = -1)
        {
            try
            {
                var existingUnitMeasure = GetUnitMeasure(unitMeasureId);
                _ctx.Entry(existingUnitMeasure).CurrentValues.SetValues(unitMeasure);
                _ctx.Entry(existingUnitMeasure).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingUnitMeasure).Property(x => x.AdmCreatedBy).IsModified = false;
                var unitMeasureEntityEntry = _ctx.Entry(existingUnitMeasure);

                if (!Save(userId)) return null;
                return unitMeasureEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateUnitMeasure: {ex}");
                return null;
            }
        }

        public bool PartialUpdateUnitMeasure(int unitMeasureId, Delta<UnitMeasure> unitMeasureDelta, int userId = -1)
        {
            try
            {
                var existingUnitMeasure = GetUnitMeasure(unitMeasureId);

                unitMeasureDelta.Patch(existingUnitMeasure);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateUnitMeasure: {ex}");
                return false;
            }
        }

        public bool DeleteUnitMeasure(int unitMeasureId, int userId = -1)
        {
            try
            {
                var existingUnitMeasure = GetUnitMeasure(unitMeasureId);
                if (existingUnitMeasure == null)
                {
                    return false;
                }

                _ctx.UnitMeasures.Remove(existingUnitMeasure);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteUnitMeasure: {ex}");
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
