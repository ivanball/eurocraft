using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IDealerTypeRepository
    {
        bool DealerTypeExists(int dealerTypeId);
        bool DealerTypeExists(DealerType dealerType);
        IEnumerable<DealerType> GetDealerTypes();
        DealerType GetDealerType(int dealerTypeId, string propertyToInclude = null);
        DealerType CreateDealerType(DealerType dealerType, int userId = -1);
        DealerType UpdateDealerType(int dealerTypeId, DealerType dealerType, int userId = -1);
        bool PartialUpdateDealerType(int dealerTypeId, Delta<DealerType> dealerTypeDelta, int userId = -1);
        bool DeleteDealerType(int dealerTypeId, int userId = -1);
        bool Save(int userId);
    }
}
