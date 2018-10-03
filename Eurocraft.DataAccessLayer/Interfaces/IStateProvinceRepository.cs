using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IStateProvinceRepository
    {
        bool StateProvinceExists(int stateProvinceId);
        bool StateProvinceExists(StateProvince stateProvince);
        IEnumerable<StateProvince> GetStateProvinces();
        StateProvince GetStateProvince(int stateProvinceId, string propertyToInclude = null);
        StateProvince CreateStateProvince(StateProvince stateProvince, int userId = -1);
        StateProvince UpdateStateProvince(int stateProvinceId, StateProvince stateProvince, int userId = -1);
        bool PartialUpdateStateProvince(int stateProvinceId, Delta<StateProvince> stateProvinceDelta, int userId = -1);
        bool DeleteStateProvince(int stateProvinceId, int userId = -1);
        bool Save(int userId);
    }
}
