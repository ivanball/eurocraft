using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductSubcategoryRepository : IProductSubcategoryRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductSubcategoryRepository> _logger;

        public ProductSubcategoryRepository(AuditableContext ctx, ILogger<ProductSubcategoryRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductSubcategoryExists(int productSubcategoryId)
        {
            try
            {
                return _ctx.ProductSubcategories.Any(c => c.ProductSubcategoryId == productSubcategoryId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductSubcategoryExists: {ex}");
                return false;
            }
        }

        public bool ProductSubcategoryExists(ProductSubcategory productSubcategory)
        {
            try
            {
                return _ctx.ProductSubcategories.Any(c =>
                    c.ProductSubcategoryName == productSubcategory.ProductSubcategoryName &&
                    c.ProductCategoryId == productSubcategory.ProductCategoryId &&
                    c.ProductSubcategoryId != productSubcategory.ProductSubcategoryId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductSubcategoryExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductSubcategory> GetProductSubcategories()
        {
            try
            {
                IEnumerable<ProductSubcategory> productSubcategories = _ctx.ProductSubcategories
                    .Include(v => v.ProductCategory)
                    .OrderBy(c => c.ProductSubcategoryName).ToList();
                return productSubcategories;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductSubcategories: {ex}");
                return null;
            }
        }

        public ProductSubcategory GetProductSubcategory(int productSubcategoryId, string propertyToInclude = null)
        {
            try
            {
                ProductSubcategory productSubcategory = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    productSubcategory = _ctx.ProductSubcategories.Include(propertyToInclude)
                        .Where(c => c.ProductSubcategoryId == productSubcategoryId)
                        .FirstOrDefault();
                }
                productSubcategory = _ctx.ProductSubcategories
                    .Include(v => v.ProductCategory)
                    .Where(c => c.ProductSubcategoryId == productSubcategoryId).FirstOrDefault();

                return productSubcategory;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductSubcategory: {ex}");
                return null;
            }
        }

        public ProductSubcategory CreateProductSubcategory(ProductSubcategory productSubcategory, int userId = -1)
        {
            try
            {
                var productSubcategoryEntityEntry = _ctx.ProductSubcategories.Add(productSubcategory);

                if (!Save(userId)) return null;
                return productSubcategoryEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductSubcategory: {ex}");
                return null;
            }
        }

        public ProductSubcategory UpdateProductSubcategory(int productSubcategoryId, ProductSubcategory productSubcategory, int userId = -1)
        {
            try
            {
                var existingProductSubcategory = GetProductSubcategory(productSubcategoryId);
                _ctx.Entry(existingProductSubcategory).CurrentValues.SetValues(productSubcategory);
                _ctx.Entry(existingProductSubcategory).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductSubcategory).Property(x => x.AdmCreatedBy).IsModified = false;
                var productSubcategoryEntityEntry = _ctx.Entry(existingProductSubcategory);

                if (!Save(userId)) return null;
                return productSubcategoryEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductSubcategory: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductSubcategory(int productSubcategoryId, Delta<ProductSubcategory> productSubcategoryDelta, int userId = -1)
        {
            try
            {
                var existingProductSubcategory = GetProductSubcategory(productSubcategoryId);

                productSubcategoryDelta.Patch(existingProductSubcategory);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductSubcategory: {ex}");
                return false;
            }
        }

        public bool DeleteProductSubcategory(int productSubcategoryId, int userId = -1)
        {
            try
            {
                var existingProductSubcategory = GetProductSubcategory(productSubcategoryId);
                if (existingProductSubcategory == null)
                {
                    return false;
                }

                _ctx.ProductSubcategories.Remove(existingProductSubcategory);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductSubcategory: {ex}");
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
