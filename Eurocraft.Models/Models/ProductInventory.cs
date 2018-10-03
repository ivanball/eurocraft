using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductInventory")]
    public partial class ProductInventory
    {
        [Column("ProductInventoryID")]
        public int ProductInventoryId { get; set; }
        [Column("ProductID")]
        public int ProductId { get; set; }
        [Column("LocationID")]
        public short LocationId { get; set; }
        [Required]
        [StringLength(10)]
        public string Shelf { get; set; }
        public byte Bin { get; set; }
        public short Quantity { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [ForeignKey("LocationId")]
        [InverseProperty("ProductInventories")]
        public Location Location { get; set; }
        [ForeignKey("ProductId")]
        [InverseProperty("ProductInventories")]
        public Product Product { get; set; }
    }
}
