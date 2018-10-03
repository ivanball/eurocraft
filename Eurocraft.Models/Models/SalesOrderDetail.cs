using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("SalesOrderDetail")]
    public partial class SalesOrderDetail : AuditableEntity
    {
        [Column("SalesOrderDetailID")]
        public int SalesOrderDetailId { get; set; }
        [Column("SalesOrderID")]
        public int SalesOrderId { get; set; }
        public short OrderQty { get; set; }
        [Column("ProductID")]
        public int ProductId { get; set; }
        public decimal? HorizontalSize { get; set; }
        public decimal? VerticalSize { get; set; }
        [Column("UnitMeasureID")]
        public int? UnitMeasureId { get; set; }
        [Column(TypeName = "money")]
        public decimal UnitPrice { get; set; }
        [Column(TypeName = "money")]
        public decimal UnitPriceDiscount { get; set; }
        [Column(TypeName = "numeric(38, 6)")]
        public decimal LineTotal { get; set; }
        [StringLength(500)]
        public string Glazing { get; set; }
        [StringLength(100)]
        public string HandleColor { get; set; }
        [StringLength(100)]
        public string Color { get; set; }
        [StringLength(50)]
        public string CarrierTrackingNumber { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("SalesOrderDetails")]
        public Product Product { get; set; }
        [ForeignKey("SalesOrderId")]
        [InverseProperty("SalesOrderDetails")]
        public SalesOrderHeader SalesOrder { get; set; }
        [ForeignKey("UnitMeasureId")]
        [InverseProperty("SalesOrderDetails")]
        public UnitMeasure UnitMeasure { get; set; }
    }
}
