using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("PhoneNumberType")]
    public partial class PhoneNumberType : AuditableEntity
    {
        public PhoneNumberType()
        {
            BusinessEntityPhones = new HashSet<BusinessEntityPhone>();
        }

        [Column("PhoneNumberTypeID")]
        public int PhoneNumberTypeId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string PhoneNumberTypeName { get; set; }

        [InverseProperty("PhoneNumberType")]
        public ICollection<BusinessEntityPhone> BusinessEntityPhones { get; set; }
    }
}
