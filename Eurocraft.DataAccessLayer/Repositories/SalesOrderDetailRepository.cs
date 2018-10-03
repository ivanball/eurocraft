using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class SalesOrderDetailRepository : ISalesOrderDetailRepository
    {
        private AuditableContext _ctx;
        private ILogger<SalesOrderDetailRepository> _logger;

        public SalesOrderDetailRepository(AuditableContext ctx, ILogger<SalesOrderDetailRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool SalesOrderDetailExists(int salesOrderDetailId)
        {
            try
            {
                return _ctx.SalesOrderDetails.Any(c => c.SalesOrderDetailId == salesOrderDetailId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in SalesOrderDetailExists: {ex}");
                return false;
            }
        }

        public bool SalesOrderDetailExists(SalesOrderDetail salesOrderDetail)
        {
            try
            {
                return _ctx.SalesOrderDetails.Any(c =>
                    c.ProductId == salesOrderDetail.ProductId &&
                    c.SalesOrderId == salesOrderDetail.SalesOrderId &&
                    c.SalesOrderDetailId != salesOrderDetail.SalesOrderDetailId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in SalesOrderDetailExists: {ex}");
                return false;
            }
        }

        public IEnumerable<SalesOrderDetail> GetSalesOrderDetails()
        {
            try
            {
                IEnumerable<SalesOrderDetail> salesOrderDetails = _ctx.SalesOrderDetails
                    .Include(v => v.Product)
                    .OrderBy(c => c.Product.ProductName).ToList();
                return salesOrderDetails;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetSalesOrderDetails: {ex}");
                return null;
            }
        }

        public SalesOrderDetail GetSalesOrderDetail(int salesOrderDetailId, string propertyToInclude = null)
        {
            try
            {
                SalesOrderDetail salesOrderDetail = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    salesOrderDetail = _ctx.SalesOrderDetails.Include(propertyToInclude)
                        .Where(c => c.SalesOrderDetailId == salesOrderDetailId)
                        .FirstOrDefault();
                }
                salesOrderDetail = _ctx.SalesOrderDetails
                    .Include(v => v.Product)
                    .Where(c => c.SalesOrderDetailId == salesOrderDetailId).FirstOrDefault();

                return salesOrderDetail;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetSalesOrderDetail: {ex}");
                return null;
            }
        }

        public SalesOrderDetail CreateSalesOrderDetail(SalesOrderDetail salesOrderDetail, int userId = -1)
        {
            try
            {
                var salesOrderDetailEntityEntry = _ctx.SalesOrderDetails.Add(salesOrderDetail);

                if (!Save(userId)) return null;
                return salesOrderDetailEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateSalesOrderDetail: {ex}");
                return null;
            }
        }

        public SalesOrderDetail UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail, int userId = -1)
        {
            try
            {
                var existingSalesOrderDetail = GetSalesOrderDetail(salesOrderDetailId);
                _ctx.Entry(existingSalesOrderDetail).CurrentValues.SetValues(salesOrderDetail);
                _ctx.Entry(existingSalesOrderDetail).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingSalesOrderDetail).Property(x => x.AdmCreatedBy).IsModified = false;
                var salesOrderDetailEntityEntry = _ctx.Entry(existingSalesOrderDetail);

                if (!Save(userId)) return null;
                return salesOrderDetailEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateSalesOrderDetail: {ex}");
                return null;
            }
        }

        public bool PartialUpdateSalesOrderDetail(int salesOrderDetailId, Delta<SalesOrderDetail> salesOrderDetailDelta, int userId = -1)
        {
            try
            {
                var existingSalesOrderDetail = GetSalesOrderDetail(salesOrderDetailId);

                salesOrderDetailDelta.Patch(existingSalesOrderDetail);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateSalesOrderDetail: {ex}");
                return false;
            }
        }

        public bool DeleteSalesOrderDetail(int salesOrderDetailId, int userId = -1)
        {
            try
            {
                var existingSalesOrderDetail = GetSalesOrderDetail(salesOrderDetailId);
                if (existingSalesOrderDetail == null)
                {
                    return false;
                }

                _ctx.SalesOrderDetails.Remove(existingSalesOrderDetail);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteSalesOrderDetail: {ex}");
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
