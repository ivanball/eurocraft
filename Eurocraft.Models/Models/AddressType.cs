using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("AddressType")]
    public partial class AddressType : AuditableEntity
    {
        public AddressType()
        {
            BusinessEntityAddresses = new HashSet<BusinessEntityAddress>();
        }

        [Column("AddressTypeID")]
        public int AddressTypeId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string AddressTypeName { get; set; }

        [InverseProperty("AddressType")]
        public ICollection<BusinessEntityAddress> BusinessEntityAddresses { get; set; }
    }
}
