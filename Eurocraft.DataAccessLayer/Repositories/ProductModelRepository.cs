using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductModelRepository : IProductModelRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductModelRepository> _logger;

        public ProductModelRepository(AuditableContext ctx, ILogger<ProductModelRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductModelExists(int productModelId)
        {
            try
            {
                return _ctx.ProductModels.Any(c => c.ProductModelId == productModelId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductModelExists: {ex}");
                return false;
            }
        }

        public bool ProductModelExists(ProductModel productModel)
        {
            try
            {
                return _ctx.ProductModels.Any(c => c.ProductModelName == productModel.ProductModelName && c.ProductModelId != productModel.ProductModelId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductModelExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductModel> GetProductModels()
        {
            try
            {
                IEnumerable<ProductModel> productModels = _ctx.ProductModels
                    .OrderBy(c => c.ProductModelName).ToList();
                return productModels;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductModels: {ex}");
                return null;
            }
        }

        public ProductModel GetProductModel(int productModelId, string propertyToInclude = null)
        {
            try
            {
                ProductModel productModel = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    productModel = _ctx.ProductModels.Include(propertyToInclude)
                        .Where(c => c.ProductModelId == productModelId)
                        .FirstOrDefault();
                }
                productModel = _ctx.ProductModels
                    .Where(c => c.ProductModelId == productModelId).FirstOrDefault();

                return productModel;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductModel: {ex}");
                return null;
            }
        }

        public ProductModel CreateProductModel(ProductModel productModel, int userId = -1)
        {
            try
            {
                var productModelEntityEntry = _ctx.ProductModels.Add(productModel);

                if (!Save(userId)) return null;
                return productModelEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductModel: {ex}");
                return null;
            }
        }

        public ProductModel UpdateProductModel(int productModelId, ProductModel productModel, int userId = -1)
        {
            try
            {
                var existingProductModel = GetProductModel(productModelId);
                _ctx.Entry(existingProductModel).CurrentValues.SetValues(productModel);
                _ctx.Entry(existingProductModel).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductModel).Property(x => x.AdmCreatedBy).IsModified = false;
                var productModelEntityEntry = _ctx.Entry(existingProductModel);

                if (!Save(userId)) return null;
                return productModelEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductModel: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductModel(int productModelId, Delta<ProductModel> productModelDelta, int userId = -1)
        {
            try
            {
                var existingProductModel = GetProductModel(productModelId);

                productModelDelta.Patch(existingProductModel);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductModel: {ex}");
                return false;
            }
        }

        public bool DeleteProductModel(int productModelId, int userId = -1)
        {
            try
            {
                var existingProductModel = GetProductModel(productModelId);
                if (existingProductModel == null)
                {
                    return false;
                }

                _ctx.ProductModels.Remove(existingProductModel);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductModel: {ex}");
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
