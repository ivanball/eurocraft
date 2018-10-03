using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductRepository : IProductRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductRepository> _logger;

        public ProductRepository(AuditableContext ctx, ILogger<ProductRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductExists(int productId)
        {
            try
            {
                return _ctx.Products.Any(c => c.ProductId == productId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductExists: {ex}");
                return false;
            }
        }

        public bool ProductExists(Product product)
        {
            try
            {
                return _ctx.Products.Any(c =>
                    c.ProductNumber == product.ProductNumber && 
                    c.ProductSubcategoryId == product.ProductSubcategoryId &&
                    c.ProductId != product.ProductId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductExists: {ex}");
                return false;
            }
        }

        public IEnumerable<Product> GetProducts()
        {
            try
            {
                IEnumerable<Product> products = _ctx.Products
                    .Include(v => v.ProductSubcategory)
                        .ThenInclude(psc => psc.ProductCategory)
                    .OrderBy(c => c.ProductName).ToList();
                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProducts: {ex}");
                return null;
            }
        }

        public Product GetProduct(int productId, string propertyToInclude = null)
        {
            try
            {
                Product product = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    product = _ctx.Products.Include(propertyToInclude)
                        .Where(c => c.ProductId == productId)
                        .FirstOrDefault();
                }
                product = _ctx.Products
                    .Include(v => v.ProductSubcategory)
                        .ThenInclude(psc => psc.ProductCategory)
                    .Where(c => c.ProductId == productId).FirstOrDefault();

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProduct: {ex}");
                return null;
            }
        }

        public Product CreateProduct(Product product, int userId = -1)
        {
            try
            {
                var productEntityEntry = _ctx.Products.Add(product);

                if (!Save(userId)) return null;
                return productEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProduct: {ex}");
                return null;
            }
        }

        public Product UpdateProduct(int productId, Product product, int userId = -1)
        {
            try
            {
                var existingProduct = GetProduct(productId);
                _ctx.Entry(existingProduct).CurrentValues.SetValues(product);
                _ctx.Entry(existingProduct).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProduct).Property(x => x.AdmCreatedBy).IsModified = false;

                var productEntityEntry = _ctx.Entry(existingProduct);

                if (!Save(userId)) return null;
                return productEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProduct: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProduct(int productId, Delta<Product> productDelta, int userId = -1)
        {
            try
            {
                var existingProduct = GetProduct(productId);

                productDelta.Patch(existingProduct);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProduct: {ex}");
                return false;
            }
        }

        public bool DeleteProduct(int productId, int userId = -1)
        {
            try
            {
                var existingProduct = GetProduct(productId);
                if (existingProduct == null)
                {
                    return false;
                }

                _ctx.Products.Remove(existingProduct);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProduct: {ex}");
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
