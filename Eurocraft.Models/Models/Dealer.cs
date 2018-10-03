using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Dealer")]
    public partial class Dealer : AuditableEntity
    {
        public Dealer()
        {
            SalesOrderHeaders = new HashSet<SalesOrderHeader>();
        }

        [Key]
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [Column("ParentBusinessEntityID")]
        public int? ParentBusinessEntityId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string DealerName { get; set; }
        [Column("DealerTypeID")]
        public int? DealerTypeId { get; set; }
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
        [InverseProperty("Dealer")]
        public BusinessEntity BusinessEntity { get; set; }
        [ForeignKey("DealerTypeId")]
        [InverseProperty("Dealers")]
        public DealerType DealerType { get; set; }
        [InverseProperty("Dealer")]
        public ICollection<SalesOrderHeader> SalesOrderHeaders { get; set; }
    }
}
