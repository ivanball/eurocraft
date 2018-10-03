using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class VendorDto
    {
        [Key]
        public int BusinessEntityId { get; set; }
        public string VendorName { get; set; }
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
