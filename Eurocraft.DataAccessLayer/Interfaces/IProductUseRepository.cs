using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductUseRepository
    {
        bool ProductUseExists(int productUseId);
        bool ProductUseExists(ProductUse productUse);
        IEnumerable<ProductUse> GetProductUses();
        ProductUse GetProductUse(int productUseId, string propertyToInclude = null);
        ProductUse CreateProductUse(ProductUse productUse, int userId = -1);
        ProductUse UpdateProductUse(int productUseId, ProductUse productUse, int userId = -1);
        bool PartialUpdateProductUse(int productUseId, Delta<ProductUse> productUseDelta, int userId = -1);
        bool DeleteProductUse(int productUseId, int userId = -1);
        bool Save(int userId);
    }
}
