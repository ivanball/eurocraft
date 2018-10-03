using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IPaymentTypeRepository
    {
        bool PaymentTypeExists(int paymentTypeId);
        bool PaymentTypeExists(PaymentType paymentType);
        IEnumerable<PaymentType> GetPaymentTypes();
        PaymentType GetPaymentType(int paymentTypeId, string propertyToInclude = null);
        PaymentType CreatePaymentType(PaymentType paymentType, int userId = -1);
        PaymentType UpdatePaymentType(int paymentTypeId, PaymentType paymentType, int userId = -1);
        bool PartialUpdatePaymentType(int paymentTypeId, Delta<PaymentType> paymentTypeDelta, int userId = -1);
        bool DeletePaymentType(int paymentTypeId, int userId = -1);
        bool Save(int userId);
    }
}
