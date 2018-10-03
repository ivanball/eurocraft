using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface ISalesOrderDetailRepository
    {
        bool SalesOrderDetailExists(int salesOrderDetailId);
        bool SalesOrderDetailExists(SalesOrderDetail salesOrderDetail);
        IEnumerable<SalesOrderDetail> GetSalesOrderDetails();
        SalesOrderDetail GetSalesOrderDetail(int salesOrderDetailId, string propertyToInclude = null);
        SalesOrderDetail CreateSalesOrderDetail(SalesOrderDetail salesOrderDetail, int userId = -1);
        SalesOrderDetail UpdateSalesOrderDetail(int salesOrderDetailId, SalesOrderDetail salesOrderDetail, int userId = -1);
        bool PartialUpdateSalesOrderDetail(int salesOrderDetailId, Delta<SalesOrderDetail> salesOrderDetailDelta, int userId = -1);
        bool DeleteSalesOrderDetail(int salesOrderDetailId, int userId = -1);
        bool Save(int userId);
    }
}
