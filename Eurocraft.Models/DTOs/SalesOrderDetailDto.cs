using System;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class SalesOrderDetailDto
    {
        [Key]
        public int SalesOrderDetailId { get; set; }
        public int SalesOrderId { get; set; }
        public short OrderQty { get; set; }
        public int ProductId { get; set; }
        public decimal? HorizontalSize { get; set; }
        public decimal? VerticalSize { get; set; }
        public int? UnitMeasureId { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitPriceDiscount { get; set; }
        public decimal LineTotal { get; set; }
        public string Glazing { get; set; }
        public string HandleColor { get; set; }
        public string Color { get; set; }
        public string CarrierTrackingNumber { get; set; }

        public string ProductName { get; set; }
    }
}
