using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductVendor")]
    public partial class ProductVendor
    {
        [Column("ProductVendorID")]
        public int ProductVendorId { get; set; }
        [Column("ProductID")]
        public int ProductId { get; set; }
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        public int AverageLeadTime { get; set; }
        [Column(TypeName = "money")]
        public decimal StandardPrice { get; set; }
        [Column(TypeName = "money")]
        public decimal? LastReceiptCost { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? LastReceiptDate { get; set; }
        public int MinOrderQty { get; set; }
        public int MaxOrderQty { get; set; }
        public int? OnOrderQty { get; set; }
        [Column("UnitMeasureID")]
        public int UnitMeasureId { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("ProductVendors")]
        public Vendor BusinessEntity { get; set; }
        [ForeignKey("ProductId")]
        [InverseProperty("ProductVendors")]
        public Product Product { get; set; }
        [ForeignKey("UnitMeasureId")]
        [InverseProperty("ProductVendors")]
        public UnitMeasure UnitMeasure { get; set; }
    }
}
