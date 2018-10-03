using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IAddressTypeRepository
    {
        bool AddressTypeExists(int addressTypeId);
        bool AddressTypeExists(AddressType addressType);
        IEnumerable<AddressType> GetAddressTypes();
        AddressType GetAddressType(int addressTypeId, string propertyToInclude = null);
        AddressType CreateAddressType(AddressType addressType, int userId = -1);
        AddressType UpdateAddressType(int addressTypeId, AddressType addressType, int userId = -1);
        bool PartialUpdateAddressType(int addressTypeId, Delta<AddressType> addressTypeDelta, int userId = -1);
        bool DeleteAddressType(int addressTypeId, int userId = 1);
        bool Save(int userId);
    }
}
