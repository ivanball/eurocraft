using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductMaterialRepository : IProductMaterialRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductMaterialRepository> _logger;

        public ProductMaterialRepository(AuditableContext ctx, ILogger<ProductMaterialRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductMaterialExists(int addressMaterialId)
        {
            try
            {
                return _ctx.ProductMaterials.Any(c => c.ProductMaterialId == addressMaterialId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductMaterialExists: {ex}");
                return false;
            }
        }

        public bool ProductMaterialExists(ProductMaterial productMaterial)
        {
            try
            {
                return _ctx.ProductMaterials.Any(c => c.ProductMaterialName == productMaterial.ProductMaterialName && c.ProductMaterialId != productMaterial.ProductMaterialId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductMaterialExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductMaterial> GetProductMaterials()
        {
            try
            {
                IEnumerable<ProductMaterial> addressMaterials = _ctx.ProductMaterials
                    .OrderBy(c => c.ProductMaterialName).ToList();
                return addressMaterials;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductMaterials: {ex}");
                return null;
            }
        }

        public ProductMaterial GetProductMaterial(int addressMaterialId, string propertyToInclude = null)
        {
            try
            {
                ProductMaterial addressMaterial = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    addressMaterial = _ctx.ProductMaterials.Include(propertyToInclude)
                        .Where(c => c.ProductMaterialId == addressMaterialId)
                        .FirstOrDefault();
                }
                addressMaterial = _ctx.ProductMaterials
                    .Where(c => c.ProductMaterialId == addressMaterialId).FirstOrDefault();

                return addressMaterial;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductMaterial: {ex}");
                return null;
            }
        }

        public ProductMaterial CreateProductMaterial(ProductMaterial addressMaterial, int userId = -1)
        {
            try
            {
                var addressMaterialEntityEntry = _ctx.ProductMaterials.Add(addressMaterial);

                if (!Save(userId)) return null;
                return addressMaterialEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductMaterial: {ex}");
                return null;
            }
        }

        public ProductMaterial UpdateProductMaterial(int addressMaterialId, ProductMaterial addressMaterial, int userId = -1)
        {
            try
            {
                var existingProductMaterial = GetProductMaterial(addressMaterialId);
                _ctx.Entry(existingProductMaterial).CurrentValues.SetValues(addressMaterial);
                _ctx.Entry(existingProductMaterial).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductMaterial).Property(x => x.AdmCreatedBy).IsModified = false;
                var addressMaterialEntityEntry = _ctx.Entry(existingProductMaterial);

                if (!Save(userId)) return null;
                return addressMaterialEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductMaterial: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductMaterial(int addressMaterialId, Delta<ProductMaterial> addressMaterialDelta, int userId = -1)
        {
            try
            {
                var existingProductMaterial = GetProductMaterial(addressMaterialId);

                addressMaterialDelta.Patch(existingProductMaterial);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductMaterial: {ex}");
                return false;
            }
        }

        public bool DeleteProductMaterial(int addressMaterialId, int userId = -1)
        {
            try
            {
                var existingProductMaterial = GetProductMaterial(addressMaterialId);
                if (existingProductMaterial == null)
                {
                    return false;
                }

                _ctx.ProductMaterials.Remove(existingProductMaterial);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductMaterial: {ex}");
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
