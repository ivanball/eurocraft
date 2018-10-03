using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("PurchaseOrderDetail")]
    public partial class PurchaseOrderDetail
    {
        [Column("PurchaseOrderDetailID")]
        public int PurchaseOrderDetailId { get; set; }
        [Column("PurchaseOrderID")]
        public int PurchaseOrderId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DueDate { get; set; }
        public short OrderQty { get; set; }
        [Column("ProductID")]
        public int ProductId { get; set; }
        [Column(TypeName = "money")]
        public decimal UnitPrice { get; set; }
        [Column(TypeName = "money")]
        public decimal LineTotal { get; set; }
        [Column(TypeName = "decimal(8, 2)")]
        public decimal ReceivedQty { get; set; }
        [Column(TypeName = "decimal(8, 2)")]
        public decimal RejectedQty { get; set; }
        [Column(TypeName = "decimal(9, 2)")]
        public decimal StockedQty { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("PurchaseOrderDetails")]
        public Product Product { get; set; }
        [ForeignKey("PurchaseOrderId")]
        [InverseProperty("PurchaseOrderDetails")]
        public PurchaseOrderHeader PurchaseOrder { get; set; }
    }
}
