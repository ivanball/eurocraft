using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductUseRepository : IProductUseRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductUseRepository> _logger;

        public ProductUseRepository(AuditableContext ctx, ILogger<ProductUseRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductUseExists(int addressUseId)
        {
            try
            {
                return _ctx.ProductUses.Any(c => c.ProductUseId == addressUseId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductUseExists: {ex}");
                return false;
            }
        }

        public bool ProductUseExists(ProductUse productUse)
        {
            try
            {
                return _ctx.ProductUses.Any(c => c.ProductUseName == productUse.ProductUseName && c.ProductUseId != productUse.ProductUseId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductUseExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductUse> GetProductUses()
        {
            try
            {
                IEnumerable<ProductUse> addressUses = _ctx.ProductUses
                    .OrderBy(c => c.ProductUseName).ToList();
                return addressUses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductUses: {ex}");
                return null;
            }
        }

        public ProductUse GetProductUse(int addressUseId, string propertyToInclude = null)
        {
            try
            {
                ProductUse addressUse = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    addressUse = _ctx.ProductUses.Include(propertyToInclude)
                        .Where(c => c.ProductUseId == addressUseId)
                        .FirstOrDefault();
                }
                addressUse = _ctx.ProductUses
                    .Where(c => c.ProductUseId == addressUseId).FirstOrDefault();

                return addressUse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductUse: {ex}");
                return null;
            }
        }

        public ProductUse CreateProductUse(ProductUse addressUse, int userId = -1)
        {
            try
            {
                var addressUseEntityEntry = _ctx.ProductUses.Add(addressUse);

                if (!Save(userId)) return null;
                return addressUseEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductUse: {ex}");
                return null;
            }
        }

        public ProductUse UpdateProductUse(int addressUseId, ProductUse addressUse, int userId = -1)
        {
            try
            {
                var existingProductUse = GetProductUse(addressUseId);
                _ctx.Entry(existingProductUse).CurrentValues.SetValues(addressUse);
                _ctx.Entry(existingProductUse).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductUse).Property(x => x.AdmCreatedBy).IsModified = false;
                var addressUseEntityEntry = _ctx.Entry(existingProductUse);

                if (!Save(userId)) return null;
                return addressUseEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductUse: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductUse(int addressUseId, Delta<ProductUse> addressUseDelta, int userId = -1)
        {
            try
            {
                var existingProductUse = GetProductUse(addressUseId);

                addressUseDelta.Patch(existingProductUse);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductUse: {ex}");
                return false;
            }
        }

        public bool DeleteProductUse(int addressUseId, int userId = -1)
        {
            try
            {
                var existingProductUse = GetProductUse(addressUseId);
                if (existingProductUse == null)
                {
                    return false;
                }

                _ctx.ProductUses.Remove(existingProductUse);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductUse: {ex}");
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
