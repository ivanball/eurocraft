using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductSubcategoryRepository
    {
        bool ProductSubcategoryExists(int productSubcategoryId);
        bool ProductSubcategoryExists(ProductSubcategory productSubcategory);
        IEnumerable<ProductSubcategory> GetProductSubcategories();
        ProductSubcategory GetProductSubcategory(int productSubcategoryId, string propertyToInclude = null);
        ProductSubcategory CreateProductSubcategory(ProductSubcategory productSubcategory, int userId = -1);
        ProductSubcategory UpdateProductSubcategory(int productSubcategoryId, ProductSubcategory productSubcategory, int userId = -1);
        bool PartialUpdateProductSubcategory(int productSubcategoryId, Delta<ProductSubcategory> productSubcategoryDelta, int userId = -1);
        bool DeleteProductSubcategory(int productSubcategoryId, int userId = -1);
        bool Save(int userId);
    }
}
