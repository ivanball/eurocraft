using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Location")]
    public partial class Location
    {
        public Location()
        {
            ProductInventories = new HashSet<ProductInventory>();
        }

        [Column("LocationID")]
        public short LocationId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string LocationName { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [InverseProperty("Location")]
        public ICollection<ProductInventory> ProductInventories { get; set; }
    }
}
