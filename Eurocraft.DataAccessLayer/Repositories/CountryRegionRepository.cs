using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class CountryRegionRepository : ICountryRegionRepository
    {
        private AuditableContext _ctx;
        private ILogger<CountryRegionRepository> _logger;

        public CountryRegionRepository(AuditableContext ctx, ILogger<CountryRegionRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool CountryRegionExists(int countryRegionId)
        {
            try
            {
                return _ctx.CountryRegions.Any(c => c.CountryRegionId == countryRegionId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CountryRegionExists: {ex}");
                return false;
            }
        }

        public bool CountryRegionExists(CountryRegion countryRegion)
        {
            try
            {
                return _ctx.CountryRegions.Any(c => c.CountryRegionName == countryRegion.CountryRegionName && c.CountryRegionId != countryRegion.CountryRegionId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CountryRegionExists: {ex}");
                return false;
            }
        }

        public IEnumerable<CountryRegion> GetCountryRegions()
        {
            try
            {
                IEnumerable<CountryRegion> CountryRegions = _ctx.CountryRegions
                    .OrderBy(c => c.CountryRegionName).ToList();
                return CountryRegions;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetCountryRegions: {ex}");
                return null;
            }
        }

        public CountryRegion GetCountryRegion(int countryRegionId, string propertyToInclude = null)
        {
            try
            {
                CountryRegion CountryRegion = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    CountryRegion = _ctx.CountryRegions.Include(propertyToInclude)
                        .Where(c => c.CountryRegionId == countryRegionId)
                        .FirstOrDefault();
                }
                CountryRegion = _ctx.CountryRegions
                    .Where(c => c.CountryRegionId == countryRegionId).FirstOrDefault();

                return CountryRegion;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetCountryRegion: {ex}");
                return null;
            }
        }

        public CountryRegion CreateCountryRegion(CountryRegion CountryRegion, int userId = -1)
        {
            try
            {
                var CountryRegionEntityEntry = _ctx.CountryRegions.Add(CountryRegion);

                if (!Save(userId)) return null;
                return CountryRegionEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateCountryRegion: {ex}");
                return null;
            }
        }

        public CountryRegion UpdateCountryRegion(int countryRegionId, CountryRegion countryRegion, int userId = -1)
        {
            try
            {
                var existingCountryRegion = GetCountryRegion(countryRegionId);
                _ctx.Entry(existingCountryRegion).CurrentValues.SetValues(countryRegion);
                _ctx.Entry(existingCountryRegion).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingCountryRegion).Property(x => x.AdmCreatedBy).IsModified = false;
                var CountryRegionEntityEntry = _ctx.Entry(existingCountryRegion);

                if (!Save(userId)) return null;
                return CountryRegionEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateCountryRegion: {ex}");
                return null;
            }
        }

        public bool PartialUpdateCountryRegion(int countryRegionId, Delta<CountryRegion> countryRegionDelta, int userId = -1)
        {
            try
            {
                var existingCountryRegion = GetCountryRegion(countryRegionId);

                countryRegionDelta.Patch(existingCountryRegion);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateCountryRegion: {ex}");
                return false;
            }
        }

        public bool DeleteCountryRegion(int countryRegionId, int userId = -1)
        {
            try
            {
                var existingCountryRegion = GetCountryRegion(countryRegionId);
                if (existingCountryRegion == null)
                {
                    return false;
                }

                _ctx.CountryRegions.Remove(existingCountryRegion);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteCountryRegion: {ex}");
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
