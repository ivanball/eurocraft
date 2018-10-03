using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductModel")]
    public partial class ProductModel : AuditableEntity
    {
        public ProductModel()
        {
            ProductCategories = new HashSet<ProductCategory>();
        }

        [Column("ProductModelID")]
        public int ProductModelId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductModelName { get; set; }

        [InverseProperty("ProductModel")]
        public ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
