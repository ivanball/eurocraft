using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("PurchaseOrderHeader")]
    public partial class PurchaseOrderHeader
    {
        public PurchaseOrderHeader()
        {
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
        }

        [Key]
        [Column("PurchaseOrderID")]
        public int PurchaseOrderId { get; set; }
        public byte RevisionNumber { get; set; }
        public byte Status { get; set; }
        [Column("VendorID")]
        public int VendorId { get; set; }
        [Column("ShipMethodID")]
        public int ShipMethodId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime OrderDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ShipDate { get; set; }
        [Column(TypeName = "money")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "money")]
        public decimal TaxAmt { get; set; }
        [Column(TypeName = "money")]
        public decimal Freight { get; set; }
        [Column(TypeName = "money")]
        public decimal TotalDue { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [ForeignKey("ShipMethodId")]
        [InverseProperty("PurchaseOrderHeaders")]
        public ShipMethod ShipMethod { get; set; }
        [ForeignKey("VendorId")]
        [InverseProperty("PurchaseOrderHeaders")]
        public Vendor Vendor { get; set; }
        [InverseProperty("PurchaseOrder")]
        public ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
    }
}
