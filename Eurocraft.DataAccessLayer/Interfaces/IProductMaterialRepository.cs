using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IProductMaterialRepository
    {
        bool ProductMaterialExists(int productMaterialId);
        bool ProductMaterialExists(ProductMaterial productMaterial);
        IEnumerable<ProductMaterial> GetProductMaterials();
        ProductMaterial GetProductMaterial(int productMaterialId, string propertyToInclude = null);
        ProductMaterial CreateProductMaterial(ProductMaterial productMaterial, int userId = -1);
        ProductMaterial UpdateProductMaterial(int productMaterialId, ProductMaterial productMaterial, int userId = -1);
        bool PartialUpdateProductMaterial(int productMaterialId, Delta<ProductMaterial> productMaterialDelta, int userId = -1);
        bool DeleteProductMaterial(int productMaterialId, int userId = -1);
        bool Save(int userId);
    }
}
