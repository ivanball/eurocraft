using System;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class SalesOrderHeaderDto
    {
        [Key]
        public int SalesOrderId { get; set; }
        public byte RevisionNumber { get; set; }
        public string SalesOrderNo { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ShipDate { get; set; }
        public byte Status { get; set; }
        public int DealerId { get; set; }
        public int? SalesPersonId { get; set; }
        public int? BillToAddressId { get; set; }
        public int? ShipToAddressId { get; set; }
        public int? ShipMethodId { get; set; }
        public int? PaymentTypeId { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmt { get; set; }
        public decimal Freight { get; set; }
        public decimal TotalDue { get; set; }
        public string Comment { get; set; }

        public string DealerName { get; set; }
        public string PaymentTypeName { get; set; }
    }
}
