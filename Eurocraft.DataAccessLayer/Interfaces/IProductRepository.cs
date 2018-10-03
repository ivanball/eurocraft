using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductRepository
    {
        bool ProductExists(int productId);
        bool ProductExists(Product product);
        IEnumerable<Product> GetProducts();
        Product GetProduct(int productId, string propertyToInclude = null);
        Product CreateProduct(Product product, int userId = -1);
        Product UpdateProduct(int productId, Product product, int userId = -1);
        bool PartialUpdateProduct(int productId, Delta<Product> productDelta, int userId = -1);
        bool DeleteProduct(int productId, int userId = -1);
        bool Save(int userId);
    }
}
