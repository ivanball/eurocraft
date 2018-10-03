using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductMaterial")]
    public partial class ProductMaterial : AuditableEntity
    {
        public ProductMaterial()
        {
            ProductCategories = new HashSet<ProductCategory>();
        }

        [Column("ProductMaterialID")]
        public int ProductMaterialId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductMaterialName { get; set; }

        [InverseProperty("ProductMaterial")]
        public ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
