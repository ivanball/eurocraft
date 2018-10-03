using Eurocraft.Models;
using System.Collections.Generic;
using Microsoft.AspNet.OData;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IBillOfMaterialRepository
    {
        bool BillOfMaterialExists(int billOfMaterialsId);
        bool BillOfMaterialExists(BillOfMaterial billOfMaterial);
        IEnumerable<BillOfMaterial> GetBillOfMaterials();
        BillOfMaterial GetBillOfMaterial(int billOfMaterialsId, string propertyToInclude = null);
        BillOfMaterial CreateBillOfMaterial(BillOfMaterial billOfMaterial, int userId = -1);
        BillOfMaterial UpdateBillOfMaterial(int billOfMaterialsId, BillOfMaterial billOfMaterial, int userId = -1);
        bool PartialUpdateBillOfMaterial(int billOfMaterialsId, Delta<BillOfMaterial> billOfMaterialDelta, int userId = -1);
        bool DeleteBillOfMaterial(int billOfMaterialsId, int userId = -1);
        bool Save(int userId);
    }
}
