using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Address")]
    public partial class Address : AuditableEntity
    {
        public Address()
        {
            BusinessEntityAddresses = new HashSet<BusinessEntityAddress>();
            SalesOrderHeaderBillToAddresses = new HashSet<SalesOrderHeader>();
            SalesOrderHeaderShipToAddresses = new HashSet<SalesOrderHeader>();
        }

        [Column("AddressID")]
        public int AddressId { get; set; }
        [Required]
        [StringLength(250)]
        public string AddressLine1 { get; set; }
        [StringLength(250)]
        public string AddressLine2 { get; set; }
        [Required]
        [StringLength(100)]
        public string AddressCity { get; set; }
        [Column("StateProvinceID")]
        public int StateProvinceId { get; set; }
        [Required]
        [StringLength(15)]
        public string PostalCode { get; set; }

        [ForeignKey("StateProvinceId")]
        [InverseProperty("Addresses")]
        public StateProvince StateProvince { get; set; }
        [InverseProperty("Address")]
        public ICollection<BusinessEntityAddress> BusinessEntityAddresses { get; set; }
        [InverseProperty("BillToAddress")]
        public ICollection<SalesOrderHeader> SalesOrderHeaderBillToAddresses { get; set; }
        [InverseProperty("ShipToAddress")]
        public ICollection<SalesOrderHeader> SalesOrderHeaderShipToAddresses { get; set; }
    }
}
