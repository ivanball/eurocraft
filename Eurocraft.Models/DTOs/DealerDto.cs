using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class DealerDto
    {
        [Key]
        public int BusinessEntityId { get; set; }
        public int? ParentBusinessEntityId { get; set; }
        public string DealerName { get; set; }
        public int? DealerTypeId { get; set; }
        public string AccountNumber { get; set; }
        public string Website { get; set; }
        public string IsTaxExempt { get; set; }
        public string PaymentTerms { get; set; }
        public decimal? PricingLevel { get; set; }
        public decimal? CreditAmount { get; set; }
        public BusinessEntityDto BusinessEntity { get; set; } = new BusinessEntityDto();
        public string PhoneNumber { get; set; }
        public string AddressCity { get; set; }
    }
}
