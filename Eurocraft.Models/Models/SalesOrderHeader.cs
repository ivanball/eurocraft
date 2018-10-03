using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("SalesOrderHeader")]
    public partial class SalesOrderHeader : AuditableEntity
    {
        public SalesOrderHeader()
        {
            SalesOrderDetails = new HashSet<SalesOrderDetail>();
        }

        [Key]
        [Column("SalesOrderID")]
        public int SalesOrderId { get; set; }
        public byte RevisionNumber { get; set; }
        [StringLength(50)]
        public string SalesOrderNo { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime OrderDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DueDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ShipDate { get; set; }
        public byte Status { get; set; }
        [Column("DealerID")]
        public int DealerId { get; set; }
        [Column("SalesPersonID")]
        public int? SalesPersonId { get; set; }
        [Column("BillToAddressID")]
        public int? BillToAddressId { get; set; }
        [Column("ShipToAddressID")]
        public int? ShipToAddressId { get; set; }
        [Column("ShipMethodID")]
        public int? ShipMethodId { get; set; }
        [Column("PaymentTypeID")]
        public int? PaymentTypeId { get; set; }
        [Column(TypeName = "money")]
        public decimal SubTotal { get; set; }
        [Column(TypeName = "money")]
        public decimal TaxAmt { get; set; }
        [Column(TypeName = "money")]
        public decimal Freight { get; set; }
        [Column(TypeName = "money")]
        public decimal TotalDue { get; set; }
        [StringLength(2000)]
        public string Comment { get; set; }

        [ForeignKey("BillToAddressId")]
        [InverseProperty("SalesOrderHeaderBillToAddresses")]
        public Address BillToAddress { get; set; }
        [ForeignKey("DealerId")]
        [InverseProperty("SalesOrderHeaders")]
        public Dealer Dealer { get; set; }
        [ForeignKey("PaymentTypeId")]
        [InverseProperty("SalesOrderHeaders")]
        public PaymentType PaymentType { get; set; }
        [ForeignKey("ShipMethodId")]
        [InverseProperty("SalesOrderHeaders")]
        public ShipMethod ShipMethod { get; set; }
        [ForeignKey("ShipToAddressId")]
        [InverseProperty("SalesOrderHeaderShipToAddresses")]
        public Address ShipToAddress { get; set; }
        [InverseProperty("SalesOrder")]
        public ICollection<SalesOrderDetail> SalesOrderDetails { get; set; }
    }
}
