using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductCategoryRepository : IProductCategoryRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductCategoryRepository> _logger;

        public ProductCategoryRepository(AuditableContext ctx, ILogger<ProductCategoryRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductCategoryExists(int productCategoryId)
        {
            try
            {
                return _ctx.ProductCategories.Any(c => c.ProductCategoryId == productCategoryId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductCategoryExists: {ex}");
                return false;
            }
        }

        public bool ProductCategoryExists(ProductCategory productCategory)
        {
            try
            {
                return _ctx.ProductCategories.Any(c => c.ProductCategoryName == productCategory.ProductCategoryName && c.ProductCategoryId != productCategory.ProductCategoryId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductCategoryExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductCategory> GetProductCategories()
        {
            try
            {
                IEnumerable<ProductCategory> productCategories = _ctx.ProductCategories
                    .Include(v => v.ProductMaterial)
                    .Include(v => v.ProductModel)
                    .Include(v => v.ProductType)
                    .Include(v => v.ProductUse)
                    .OrderBy(c => c.ProductCategoryName).ToList();
                return productCategories;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductCategories: {ex}");
                return null;
            }
        }

        public ProductCategory GetProductCategory(int productCategoryId, string propertyToInclude = null)
        {
            try
            {
                ProductCategory productCategory = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    productCategory = _ctx.ProductCategories.Include(propertyToInclude)
                        .Where(c => c.ProductCategoryId == productCategoryId)
                        .FirstOrDefault();
                }
                productCategory = _ctx.ProductCategories
                    .Include(v => v.ProductMaterial)
                    .Include(v => v.ProductModel)
                    .Include(v => v.ProductType)
                    .Include(v => v.ProductUse)
                    .Where(c => c.ProductCategoryId == productCategoryId).FirstOrDefault();

                return productCategory;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductCategory: {ex}");
                return null;
            }
        }

        public ProductCategory CreateProductCategory(ProductCategory productCategory, int userId = -1)
        {
            try
            {
                var productCategoryEntityEntry = _ctx.ProductCategories.Add(productCategory);

                if (!Save(userId)) return null;
                return productCategoryEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductCategory: {ex}");
                return null;
            }
        }

        public ProductCategory UpdateProductCategory(int productCategoryId, ProductCategory productCategory, int userId = -1)
        {
            try
            {
                var existingProductCategory = GetProductCategory(productCategoryId);
                _ctx.Entry(existingProductCategory).CurrentValues.SetValues(productCategory);
                _ctx.Entry(existingProductCategory).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductCategory).Property(x => x.AdmCreatedBy).IsModified = false;
                var productCategoryEntityEntry = _ctx.Entry(existingProductCategory);

                if (!Save(userId)) return null;
                return productCategoryEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductCategory: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductCategory(int productCategoryId, Delta<ProductCategory> productCategoryDelta, int userId = -1)
        {
            try
            {
                var existingProductCategory = GetProductCategory(productCategoryId);

                productCategoryDelta.Patch(existingProductCategory);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductCategory: {ex}");
                return false;
            }
        }

        public bool DeleteProductCategory(int productCategoryId, int userId = -1)
        {
            try
            {
                var existingProductCategory = GetProductCategory(productCategoryId);
                if (existingProductCategory == null)
                {
                    return false;
                }

                _ctx.ProductCategories.Remove(existingProductCategory);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductCategory: {ex}");
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
