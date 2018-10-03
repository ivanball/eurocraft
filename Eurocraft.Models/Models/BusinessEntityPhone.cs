using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("BusinessEntityPhone")]
    public partial class BusinessEntityPhone : AuditableEntity
    {
        [Column("BusinessEntityPhoneID")]
        public int BusinessEntityPhoneId { get; set; }
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [Required]
        [StringLength(50)]
        public string PhoneNumber { get; set; }
        [Column("PhoneNumberTypeID")]
        public int PhoneNumberTypeId { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("BusinessEntityPhones")]
        public BusinessEntity BusinessEntity { get; set; }
        [ForeignKey("PhoneNumberTypeId")]
        [InverseProperty("BusinessEntityPhones")]
        public PhoneNumberType PhoneNumberType { get; set; }
    }
}
