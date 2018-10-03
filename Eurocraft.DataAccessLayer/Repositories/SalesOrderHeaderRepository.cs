using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class SalesOrderHeaderRepository : ISalesOrderHeaderRepository
    {
        private AuditableContext _ctx;
        private ILogger<SalesOrderHeaderRepository> _logger;

        public SalesOrderHeaderRepository(AuditableContext ctx, ILogger<SalesOrderHeaderRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool SalesOrderHeaderExists(int salesOrderId)
        {
            try
            {
                return _ctx.SalesOrderHeaders.Any(c => c.SalesOrderId == salesOrderId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in SalesOrderHeaderExists: {ex}");
                return false;
            }
        }

        public bool SalesOrderHeaderExists(SalesOrderHeader salesOrderHeader)
        {
            try
            {
                return _ctx.SalesOrderHeaders.Any(c =>
                    c.SalesOrderNo == salesOrderHeader.SalesOrderNo &&
                    c.SalesOrderId != salesOrderHeader.SalesOrderId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in SalesOrderHeaderExists: {ex}");
                return false;
            }
        }

        public IEnumerable<SalesOrderHeader> GetSalesOrderHeaders()
        {
            try
            {
                IEnumerable<SalesOrderHeader> salesOrderHeaders = _ctx.SalesOrderHeaders
                    .Include(v => v.Dealer)
                    .Include(v => v.PaymentType)
                    .OrderBy(c => c.SalesOrderNo).ToList();
                return salesOrderHeaders;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetSalesOrderHeaders: {ex}");
                return null;
            }
        }

        public SalesOrderHeader GetSalesOrderHeader(int salesOrderId, string propertyToInclude = null)
        {
            try
            {
                SalesOrderHeader salesOrderHeader = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    salesOrderHeader = _ctx.SalesOrderHeaders.Include(propertyToInclude)
                        .Where(c => c.SalesOrderId == salesOrderId)
                        .FirstOrDefault();
                }
                salesOrderHeader = _ctx.SalesOrderHeaders
                    .Include(v => v.Dealer)
                    .Include(v => v.PaymentType)
                    .Where(c => c.SalesOrderId == salesOrderId).FirstOrDefault();

                return salesOrderHeader;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetSalesOrderHeader: {ex}");
                return null;
            }
        }

        public SalesOrderHeader CreateSalesOrderHeader(SalesOrderHeader salesOrderHeader, int userId = -1)
        {
            try
            {
                var salesOrderHeaderEntityEntry = _ctx.SalesOrderHeaders.Add(salesOrderHeader);

                if (!Save(userId)) return null;
                return salesOrderHeaderEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateSalesOrderHeader: {ex}");
                return null;
            }
        }

        public SalesOrderHeader UpdateSalesOrderHeader(int salesOrderId, SalesOrderHeader salesOrderHeader, int userId = -1)
        {
            try
            {
                var existingSalesOrderHeader = GetSalesOrderHeader(salesOrderId);
                _ctx.Entry(existingSalesOrderHeader).CurrentValues.SetValues(salesOrderHeader);
                _ctx.Entry(existingSalesOrderHeader).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingSalesOrderHeader).Property(x => x.AdmCreatedBy).IsModified = false;
                var salesOrderHeaderEntityEntry = _ctx.Entry(existingSalesOrderHeader);

                if (!Save(userId)) return null;
                return salesOrderHeaderEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateSalesOrderHeader: {ex}");
                return null;
            }
        }

        public bool PartialUpdateSalesOrderHeader(int salesOrderId, Delta<SalesOrderHeader> salesOrderHeaderDelta, int userId = -1)
        {
            try
            {
                var existingSalesOrderHeader = GetSalesOrderHeader(salesOrderId);

                salesOrderHeaderDelta.Patch(existingSalesOrderHeader);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateSalesOrderHeader: {ex}");
                return false;
            }
        }

        public bool DeleteSalesOrderHeader(int salesOrderId, int userId = -1)
        {
            try
            {
                var existingSalesOrderHeader = GetSalesOrderHeader(salesOrderId);
                if (existingSalesOrderHeader == null)
                {
                    return false;
                }

                _ctx.SalesOrderHeaders.Remove(existingSalesOrderHeader);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteSalesOrderHeader: {ex}");
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
