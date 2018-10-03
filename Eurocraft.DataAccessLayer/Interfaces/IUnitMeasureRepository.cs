using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IUnitMeasureRepository
    {
        bool UnitMeasureExists(int unitMeasureId);
        bool UnitMeasureExists(UnitMeasure unitMeasure);
        IEnumerable<UnitMeasure> GetUnitMeasures();
        UnitMeasure GetUnitMeasure(int unitMeasureId, string propertyToInclude = null);
        UnitMeasure CreateUnitMeasure(UnitMeasure unitMeasure, int userId = -1);
        UnitMeasure UpdateUnitMeasure(int unitMeasureId, UnitMeasure unitMeasure, int userId = -1);
        bool PartialUpdateUnitMeasure(int unitMeasureId, Delta<UnitMeasure> unitMeasureDelta, int userId = -1);
        bool DeleteUnitMeasure(int unitMeasureId, int userId = 1);
        bool Save(int userId);
    }
}
