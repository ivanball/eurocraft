using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private AuditableContext _ctx;
        private ILogger<ProductTypeRepository> _logger;

        public ProductTypeRepository(AuditableContext ctx, ILogger<ProductTypeRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool ProductTypeExists(int addressTypeId)
        {
            try
            {
                return _ctx.ProductTypes.Any(c => c.ProductTypeId == addressTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductTypeExists: {ex}");
                return false;
            }
        }

        public bool ProductTypeExists(ProductType productType)
        {
            try
            {
                return _ctx.ProductTypes.Any(c => c.ProductTypeName == productType.ProductTypeName && c.ProductTypeId != productType.ProductTypeId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in ProductTypeExists: {ex}");
                return false;
            }
        }

        public IEnumerable<ProductType> GetProductTypes()
        {
            try
            {
                IEnumerable<ProductType> addressTypes = _ctx.ProductTypes
                    .OrderBy(c => c.ProductTypeName).ToList();
                return addressTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductTypes: {ex}");
                return null;
            }
        }

        public ProductType GetProductType(int addressTypeId, string propertyToInclude = null)
        {
            try
            {
                ProductType addressType = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    addressType = _ctx.ProductTypes.Include(propertyToInclude)
                        .Where(c => c.ProductTypeId == addressTypeId)
                        .FirstOrDefault();
                }
                addressType = _ctx.ProductTypes
                    .Where(c => c.ProductTypeId == addressTypeId).FirstOrDefault();

                return addressType;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetProductType: {ex}");
                return null;
            }
        }

        public ProductType CreateProductType(ProductType addressType, int userId = -1)
        {
            try
            {
                var addressTypeEntityEntry = _ctx.ProductTypes.Add(addressType);

                if (!Save(userId)) return null;
                return addressTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateProductType: {ex}");
                return null;
            }
        }

        public ProductType UpdateProductType(int addressTypeId, ProductType addressType, int userId = -1)
        {
            try
            {
                var existingProductType = GetProductType(addressTypeId);
                _ctx.Entry(existingProductType).CurrentValues.SetValues(addressType);
                _ctx.Entry(existingProductType).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingProductType).Property(x => x.AdmCreatedBy).IsModified = false;
                var addressTypeEntityEntry = _ctx.Entry(existingProductType);

                if (!Save(userId)) return null;
                return addressTypeEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateProductType: {ex}");
                return null;
            }
        }

        public bool PartialUpdateProductType(int addressTypeId, Delta<ProductType> addressTypeDelta, int userId = -1)
        {
            try
            {
                var existingProductType = GetProductType(addressTypeId);

                addressTypeDelta.Patch(existingProductType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateProductType: {ex}");
                return false;
            }
        }

        public bool DeleteProductType(int addressTypeId, int userId = -1)
        {
            try
            {
                var existingProductType = GetProductType(addressTypeId);
                if (existingProductType == null)
                {
                    return false;
                }

                _ctx.ProductTypes.Remove(existingProductType);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteProductType: {ex}");
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
