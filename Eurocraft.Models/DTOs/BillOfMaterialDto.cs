using System;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class BillOfMaterialDto
    {
        [Key]
        public int BillOfMaterialsId { get; set; }
        public int ProductAssemblyId { get; set; }
        public string ProductAssemblyName { get; set; }
        public int ComponentId { get; set; }
        public string ComponentName { get; set; }
        public int? HorizontalQuantity { get; set; }
        public string HorizontalFormula { get; set; }
        public int? VerticalQuantity { get; set; }
        public string VerticalFormula { get; set; }
        public int UnitMeasureId { get; set; }
        public string UnitMeasureName { get; set; }
    }
}
