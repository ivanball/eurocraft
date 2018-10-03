using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("StateProvince")]
    public partial class StateProvince : AuditableEntity
    {
        public StateProvince()
        {
            Addresses = new HashSet<Address>();
        }

        [Column("StateProvinceID")]
        public int StateProvinceId { get; set; }
        [Required]
        [StringLength(3)]
        public string StateProvinceCode { get; set; }
        [Column("CountryRegionID")]
        public int CountryRegionId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string StateProvinceName { get; set; }

        [ForeignKey("CountryRegionId")]
        [InverseProperty("StateProvinces")]
        public CountryRegion CountryRegion { get; set; }
        [InverseProperty("StateProvince")]
        public ICollection<Address> Addresses { get; set; }
    }
}
