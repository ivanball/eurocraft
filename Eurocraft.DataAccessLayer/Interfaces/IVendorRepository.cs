using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IVendorRepository
    {
        bool VendorExists(int businessEntityId);
        bool VendorExists(Vendor vendor);
        IEnumerable<Vendor> GetVendors();
        Vendor GetVendor(int businessEntityId, string propertyToInclude = null);
        BusinessEntityAddress GetBusinessEntityAddress(int businessEntityAddressId);
        BusinessEntityContact GetBusinessEntityContact(int businessEntityContactId);
        BusinessEntityEmail GetBusinessEntityEmail(int businessEntityEmailId);
        BusinessEntityPhone GetBusinessEntityPhone(int businessEntityPhoneId);
        Vendor CreateVendor(Vendor vendor, int userId = -1);
        Vendor UpdateVendor(int businessEntityId, Vendor vendor, int userId = -1);
        bool PartialUpdateVendor(int businessEntityId, Delta<Vendor> vendorDelta, int userId = -1);
        bool DeleteVendor(int businessEntityId, int userId = -1);
        bool Save(int userId);
    }
}
