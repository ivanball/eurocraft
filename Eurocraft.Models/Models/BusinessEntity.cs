using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("BusinessEntity")]
    public partial class BusinessEntity : AuditableEntity
    {
        public BusinessEntity()
        {
            BusinessEntityAddresses = new HashSet<BusinessEntityAddress>();
            BusinessEntityContacts = new HashSet<BusinessEntityContact>();
            BusinessEntityEmails = new HashSet<BusinessEntityEmail>();
            BusinessEntityPhones = new HashSet<BusinessEntityPhone>();
        }

        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }

        [InverseProperty("BusinessEntity")]
        public Dealer Dealer { get; set; }
        [InverseProperty("BusinessEntity")]
        public Person Person { get; set; }
        [InverseProperty("BusinessEntity")]
        public Vendor Vendor { get; set; }
        [InverseProperty("BusinessEntity")]
        public ICollection<BusinessEntityAddress> BusinessEntityAddresses { get; set; }
        [InverseProperty("BusinessEntity")]
        public ICollection<BusinessEntityContact> BusinessEntityContacts { get; set; }
        [InverseProperty("BusinessEntity")]
        public ICollection<BusinessEntityEmail> BusinessEntityEmails { get; set; }
        [InverseProperty("BusinessEntity")]
        public ICollection<BusinessEntityPhone> BusinessEntityPhones { get; set; }
    }
}
