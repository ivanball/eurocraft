using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNet.OData;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class BillOfMaterialRepository : IBillOfMaterialRepository
    {
        private AuditableContext _ctx;
        private ILogger<BillOfMaterialRepository> _logger;

        public BillOfMaterialRepository(AuditableContext ctx, ILogger<BillOfMaterialRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool BillOfMaterialExists(int billOfMaterialsId)
        {
            try
            {
                return _ctx.BillOfMaterials.Any(c => c.BillOfMaterialsId == billOfMaterialsId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in BillOfMaterialExists: {ex}");
                return false;
            }
        }

        public bool BillOfMaterialExists(BillOfMaterial billOfMaterial)
        {
            try
            {
                return _ctx.BillOfMaterials.Any(c =>
                    c.ProductAssemblyId == billOfMaterial.ProductAssemblyId &&
                    c.ComponentId == billOfMaterial.ComponentId &&
                    c.BillOfMaterialsId != billOfMaterial.BillOfMaterialsId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in BillOfMaterialExists: {ex}");
                return false;
            }
        }

        public IEnumerable<BillOfMaterial> GetBillOfMaterials()
        {
            try
            {
                IEnumerable<BillOfMaterial> billOfMaterials = _ctx.BillOfMaterials
                    .Include(v => v.ProductAssembly)
                    .Include(v => v.Component)
                    .Include(v => v.UnitMeasure)
                    .OrderBy(c => c.ProductAssembly.ProductName).ToList();
                return billOfMaterials;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBillOfMaterials: {ex}");
                return null;
            }
        }

        public BillOfMaterial GetBillOfMaterial(int billOfMaterialsId, string propertyToInclude = null)
        {
            try
            {
                BillOfMaterial billOfMaterial = null;
                if (!String.IsNullOrEmpty(propertyToInclude))
                {
                    billOfMaterial = _ctx.BillOfMaterials.Include(propertyToInclude)
                        .Where(c => c.BillOfMaterialsId == billOfMaterialsId)
                        .FirstOrDefault();
                }
                billOfMaterial = _ctx.BillOfMaterials
                    .Include(v => v.ProductAssembly)
                    .Include(v => v.Component)
                    .Include(v => v.UnitMeasure)
                    .Where(c => c.BillOfMaterialsId == billOfMaterialsId).FirstOrDefault();

                return billOfMaterial;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetBillOfMaterial: {ex}");
                return null;
            }
        }

        public BillOfMaterial CreateBillOfMaterial(BillOfMaterial billOfMaterial, int userId = -1)
        {
            try
            {
                var billOfMaterialEntityEntry = _ctx.BillOfMaterials.Add(billOfMaterial);

                if (!Save(userId)) return null;
                return billOfMaterialEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in CreateBillOfMaterial: {ex}");
                return null;
            }
        }

        public BillOfMaterial UpdateBillOfMaterial(int billOfMaterialsId, BillOfMaterial billOfMaterial, int userId = -1)
        {
            try
            {
                var existingBillOfMaterial = GetBillOfMaterial(billOfMaterialsId);
                _ctx.Entry(existingBillOfMaterial).CurrentValues.SetValues(billOfMaterial);
                _ctx.Entry(existingBillOfMaterial).Property(x => x.AdmCreated).IsModified = false;
                _ctx.Entry(existingBillOfMaterial).Property(x => x.AdmCreatedBy).IsModified = false;

                var billOfMaterialEntityEntry = _ctx.Entry(existingBillOfMaterial);

                if (!Save(userId)) return null;
                return billOfMaterialEntityEntry.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UpdateBillOfMaterial: {ex}");
                return null;
            }
        }

        public bool PartialUpdateBillOfMaterial(int billOfMaterialsId, Delta<BillOfMaterial> billOfMaterialDelta, int userId = -1)
        {
            try
            {
                var existingBillOfMaterial = GetBillOfMaterial(billOfMaterialsId);

                billOfMaterialDelta.Patch(existingBillOfMaterial);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in PartialUpdateBillOfMaterial: {ex}");
                return false;
            }
        }

        public bool DeleteBillOfMaterial(int billOfMaterialsId, int userId = -1)
        {
            try
            {
                var existingBillOfMaterial = GetBillOfMaterial(billOfMaterialsId);
                if (existingBillOfMaterial == null)
                {
                    return false;
                }

                _ctx.BillOfMaterials.Remove(existingBillOfMaterial);

                if (!Save(userId)) return false;
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in DeleteBillOfMaterial: {ex}");
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
