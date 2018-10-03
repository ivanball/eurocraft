using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface ICountryRegionRepository
    {
        bool CountryRegionExists(int countryRegionId);
        bool CountryRegionExists(CountryRegion countryRegion);
        IEnumerable<CountryRegion> GetCountryRegions();
        CountryRegion GetCountryRegion(int countryRegionId, string propertyToInclude = null);
        CountryRegion CreateCountryRegion(CountryRegion countryRegion, int userId = -1);
        CountryRegion UpdateCountryRegion(int countryRegionId, CountryRegion countryRegion, int userId = -1);
        bool PartialUpdateCountryRegion(int countryRegionId, Delta<CountryRegion> countryRegionDelta, int userId = -1);
        bool DeleteCountryRegion(int countryRegionId, int userId = -1);
        bool Save(int userId);
    }
}
