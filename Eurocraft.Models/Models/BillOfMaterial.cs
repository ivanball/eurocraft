using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    public partial class BillOfMaterial : AuditableEntity
    {
        [Key]
        [Column("BillOfMaterialsID")]
        public int BillOfMaterialsId { get; set; }
        [Column("ProductAssemblyID")]
        public int ProductAssemblyId { get; set; }
        [Column("ComponentID")]
        public int ComponentId { get; set; }
        public int? HorizontalQuantity { get; set; }
        [StringLength(500)]
        public string HorizontalFormula { get; set; }
        public int? VerticalQuantity { get; set; }
        [StringLength(500)]
        public string VerticalFormula { get; set; }
        [Column("UnitMeasureID")]
        public int UnitMeasureId { get; set; }

        [ForeignKey("ComponentId")]
        [InverseProperty("BillOfMaterialComponents")]
        public Product Component { get; set; }
        [ForeignKey("ProductAssemblyId")]
        [InverseProperty("BillOfMaterialProductAssemblies")]
        public Product ProductAssembly { get; set; }
        [ForeignKey("UnitMeasureId")]
        [InverseProperty("BillOfMaterials")]
        public UnitMeasure UnitMeasure { get; set; }
    }
}
