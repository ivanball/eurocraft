using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IPhoneNumberTypeRepository
    {
        bool PhoneNumberTypeExists(int phoneNumberTypeId);
        bool PhoneNumberTypeExists(PhoneNumberType phoneNumberType);
        IEnumerable<PhoneNumberType> GetPhoneNumberTypes();
        PhoneNumberType GetPhoneNumberType(int phoneNumberTypeId, string propertyToInclude = null);
        PhoneNumberType CreatePhoneNumberType(PhoneNumberType phoneNumberType, int userId = -1);
        PhoneNumberType UpdatePhoneNumberType(int phoneNumberTypeId, PhoneNumberType phoneNumberType, int userId = -1);
        bool PartialUpdatePhoneNumberType(int phoneNumberTypeId, Delta<PhoneNumberType> phoneNumberTypeDelta, int userId = -1);
        bool DeletePhoneNumberType(int phoneNumberTypeId, int userId = -1);
        bool Save(int userId);
    }
}
