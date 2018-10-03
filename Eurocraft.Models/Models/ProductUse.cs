using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductUse")]
    public partial class ProductUse : AuditableEntity
    {
        public ProductUse()
        {
            ProductCategories = new HashSet<ProductCategory>();
        }

        [Column("ProductUseID")]
        public int ProductUseId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductUseName { get; set; }

        [InverseProperty("ProductUse")]
        public ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
