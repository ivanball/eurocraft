using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IDealerRepository
    {
        bool DealerExists(int businessEntityId);
        bool DealerExists(Dealer dealer);
        IEnumerable<Dealer> GetDealers();
        Dealer GetDealer(int businessEntityId, string propertyToInclude = null);
        BusinessEntityAddress GetBusinessEntityAddress(int businessEntityAddressId);
        BusinessEntityContact GetBusinessEntityContact(int businessEntityContactId);
        BusinessEntityEmail GetBusinessEntityEmail(int businessEntityEmailId);
        BusinessEntityPhone GetBusinessEntityPhone(int businessEntityPhoneId);
        Dealer CreateDealer(Dealer dealer, int userId = -1);
        Dealer UpdateDealer(int businessEntityId, Dealer dealer, int userId = -1);
        bool PartialUpdateDealer(int businessEntityId, Delta<Dealer> dealerDelta, int userId = -1);
        bool DeleteDealer(int businessEntityId, int userId = -1);
        bool Save(int userId);
    }
}
