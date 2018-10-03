using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("BusinessEntityAddress")]
    public partial class BusinessEntityAddress : AuditableEntity
    {
        [Column("BusinessEntityAddressID")]
        public int BusinessEntityAddressId { get; set; }
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [Column("AddressID")]
        public int AddressId { get; set; }
        [Column("AddressTypeID")]
        public int AddressTypeId { get; set; }

        [ForeignKey("AddressId")]
        [InverseProperty("BusinessEntityAddresses")]
        public Address Address { get; set; }
        [ForeignKey("AddressTypeId")]
        [InverseProperty("BusinessEntityAddresses")]
        public AddressType AddressType { get; set; }
        [ForeignKey("BusinessEntityId")]
        [InverseProperty("BusinessEntityAddresses")]
        public BusinessEntity BusinessEntity { get; set; }
    }
}
