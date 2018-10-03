using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface ISalesOrderHeaderRepository
    {
        bool SalesOrderHeaderExists(int salesOrderHeaderId);
        bool SalesOrderHeaderExists(SalesOrderHeader salesOrderHeader);
        IEnumerable<SalesOrderHeader> GetSalesOrderHeaders();
        SalesOrderHeader GetSalesOrderHeader(int salesOrderHeaderId, string propertyToInclude = null);
        SalesOrderHeader CreateSalesOrderHeader(SalesOrderHeader salesOrderHeader, int userId = -1);
        SalesOrderHeader UpdateSalesOrderHeader(int salesOrderHeaderId, SalesOrderHeader salesOrderHeader, int userId = -1);
        bool PartialUpdateSalesOrderHeader(int salesOrderHeaderId, Delta<SalesOrderHeader> salesOrderHeaderDelta, int userId = -1);
        bool DeleteSalesOrderHeader(int salesOrderHeaderId, int userId = -1);
        bool Save(int userId);
    }
}
