using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductModelRepository
    {
        bool ProductModelExists(int productModelId);
        bool ProductModelExists(ProductModel productModel);
        IEnumerable<ProductModel> GetProductModels();
        ProductModel GetProductModel(int productModelId, string propertyToInclude = null);
        ProductModel CreateProductModel(ProductModel productModel, int userId = -1);
        ProductModel UpdateProductModel(int productModelId, ProductModel productModel, int userId = -1);
        bool PartialUpdateProductModel(int productModelId, Delta<ProductModel> productModelDelta, int userId = -1);
        bool DeleteProductModel(int productModelId, int userId = -1);
        bool Save(int userId);
    }
}
