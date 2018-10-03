using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Vendor")]
    public partial class Vendor : AuditableEntity
    {
        public Vendor()
        {
            ProductVendors = new HashSet<ProductVendor>();
            PurchaseOrderHeaders = new HashSet<PurchaseOrderHeader>();
        }

        [Key]
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string VendorName { get; set; }
        [StringLength(100)]
        public string AccountNumber { get; set; }
        [StringLength(500)]
        public string Website { get; set; }
        [StringLength(1)]
        public string IsTaxExempt { get; set; }
        [StringLength(100)]
        public string PaymentTerms { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal? PricingLevel { get; set; }
        [Column(TypeName = "money")]
        public decimal? CreditAmount { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("Vendor")]
        public BusinessEntity BusinessEntity { get; set; }
        [InverseProperty("BusinessEntity")]
        public ICollection<ProductVendor> ProductVendors { get; set; }
        [InverseProperty("Vendor")]
        public ICollection<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
    }
}
