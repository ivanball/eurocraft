using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("UnitMeasure")]
    public partial class UnitMeasure : AuditableEntity
    {
        public UnitMeasure()
        {
            BillOfMaterials = new HashSet<BillOfMaterial>();
            ProductVendors = new HashSet<ProductVendor>();
            SalesOrderDetails = new HashSet<SalesOrderDetail>();
        }

        [Column("UnitMeasureID")]
        public int UnitMeasureId { get; set; }
        [Required]
        [StringLength(10)]
        public string UnitMeasureCode { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string UnitMeasureName { get; set; }

        [InverseProperty("UnitMeasure")]
        public ICollection<BillOfMaterial> BillOfMaterials { get; set; }
        [InverseProperty("UnitMeasure")]
        public ICollection<ProductVendor> ProductVendors { get; set; }
        [InverseProperty("UnitMeasure")]
        public ICollection<SalesOrderDetail> SalesOrderDetails { get; set; }
    }
}
