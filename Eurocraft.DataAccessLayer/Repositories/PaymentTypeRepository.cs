using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class PaymentTypeRepository : IPaymentTypeRepository
    {
        private AuditableContext _ctx;
        private ILogger<PaymentTypeRepository> _logger;

        public PaymentTypeRepository(AuditableContext ctx, ILogger<PaymentTypeRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool PaymentTypeExists(int paymentTypeId)
        {
            try
            {
                return _ctx.PaymentTypes.Any(c => c.PaymentTypeId == paymentTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PaymentTypeExists: {ex}");
                return false;
            }
        }

        public bool PaymentTypeExists(PaymentType paymentType)
        {
            try
            {
                return _ctx.PaymentTypes.Any(c => c.PaymentTypeName == paymentType.PaymentTypeName && c.PaymentTypeId != paymentType.PaymentTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PaymentTypeExists: {ex}");
                return false;
            }
        }

        public IEnumerable<PaymentType> GetPaymentTypes()
        {
            try
            {
                IEnumerable<PaymentType> paymentTypes = _ctx.PaymentTypes
                    .OrderBy(c => c.PaymentTypeName).ToList();
                return paymentTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetPaymentTypes: {ex}");
                return null;
            }
        }

        public PaymentType GetPaymentType(int paymentTypeId, string propertyToInclude = null)
        {
            try
            {
                PaymentType paymentType = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    paymentType = _ctx.PaymentTypes.Include(propertyToInclude)
                        .Where(c => c.PaymentTypeId == paymentTypeId)
                        .FirstOrDefault();
                }
                paymentType = _ctx.PaymentTypes
                    .Where(c => c.PaymentTypeId == paymentTypeId).FirstOrDefault();

                return paymentType;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetPaymentType: {ex}");
                return null;
            }
        }

        public PaymentType CreatePaymentType(PaymentType paymentType, int userId = -1)
        {
            try
            {
                var paymentTypeEntityEntry = _ctx.PaymentTypes.Add(paymentType);

                if (!Save(userId)) return null;
                return paymentTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreatePaymentType: {ex}");
                return null;
            }
        }

        public PaymentType UpdatePaymentType(int paymentTypeId, PaymentType paymentType, int userId = -1)
        {
            try
            {
                var existingPaymentType = GetPaymentType(paymentTypeId);
                _ctx.Entry(existingPaymentType).CurrentValues.SetValues(paymentType);
                _ctx.Entry(existingPaymentType).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingPaymentType).Property(x => x.AdmCreatedBy).IsModified = false;
                var paymentTypeEntityEntry = _ctx.Entry(existingPaymentType);

                if (!Save(userId)) return null;
                return paymentTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdatePaymentType: {ex}");
                return null;
            }
        }

        public bool PartialUpdatePaymentType(int paymentTypeId, Delta<PaymentType> paymentTypeDelta, int userId = -1)
        {
            try
            {
                var existingPaymentType = GetPaymentType(paymentTypeId);

                paymentTypeDelta.Patch(existingPaymentType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdatePaymentType: {ex}");
                return false;
            }
        }

        public bool DeletePaymentType(int paymentTypeId, int userId = -1)
        {
            try
            {
                var existingPaymentType = GetPaymentType(paymentTypeId);
                if (existingPaymentType == null)
                {
                    return false;
                }

                _ctx.PaymentTypes.Remove(existingPaymentType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeletePaymentType: {ex}");
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
