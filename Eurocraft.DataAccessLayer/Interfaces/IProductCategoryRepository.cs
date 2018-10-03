using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductCategoryRepository
    {
        bool ProductCategoryExists(int productCategoryId);
        bool ProductCategoryExists(ProductCategory productCategory);
        IEnumerable<ProductCategory> GetProductCategories();
        ProductCategory GetProductCategory(int productCategoryId, string propertyToInclude = null);
        ProductCategory CreateProductCategory(ProductCategory productCategory, int userId = -1);
        ProductCategory UpdateProductCategory(int productCategoryId, ProductCategory productCategory, int userId = -1);
        bool PartialUpdateProductCategory(int productCategoryId, Delta<ProductCategory> productCategoryDelta, int userId = -1);
        bool DeleteProductCategory(int productCategoryId, int userId = -1);
        bool Save(int userId);
    }
}
