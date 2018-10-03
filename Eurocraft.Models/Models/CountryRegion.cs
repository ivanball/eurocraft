using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("CountryRegion")]
    public partial class CountryRegion : AuditableEntity
    {
        public CountryRegion()
        {
            StateProvinces = new HashSet<StateProvince>();
        }

        [Column("CountryRegionID")]
        public int CountryRegionId { get; set; }
        [Required]
        [StringLength(3)]
        public string CountryRegionCode { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string CountryRegionName { get; set; }

        [InverseProperty("CountryRegion")]
        public ICollection<StateProvince> StateProvinces { get; set; }
    }
}
