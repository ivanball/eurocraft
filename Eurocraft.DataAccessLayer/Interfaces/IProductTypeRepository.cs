using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductTypeRepository
    {
        bool ProductTypeExists(int productTypeId);
        bool ProductTypeExists(ProductType productType);
        IEnumerable<ProductType> GetProductTypes();
        ProductType GetProductType(int productTypeId, string propertyToInclude = null);
        ProductType CreateProductType(ProductType productType, int userId = -1);
        ProductType UpdateProductType(int productTypeId, ProductType productType, int userId = -1);
        bool PartialUpdateProductType(int productTypeId, Delta<ProductType> productTypeDelta, int userId = -1);
        bool DeleteProductType(int productTypeId, int userId = -1);
        bool Save(int userId);
    }
}
