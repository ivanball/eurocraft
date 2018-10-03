using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductSubcategory")]
    public partial class ProductSubcategory : AuditableEntity
    {
        public ProductSubcategory()
        {
            Products = new HashSet<Product>();
        }

        [Column("ProductSubcategoryID")]
        public int ProductSubcategoryId { get; set; }
        [Column("ProductCategoryID")]
        public int ProductCategoryId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductSubcategoryName { get; set; }

        [ForeignKey("ProductCategoryId")]
        [InverseProperty("ProductSubcategories")]
        public ProductCategory ProductCategory { get; set; }
        [InverseProperty("ProductSubcategory")]
        public ICollection<Product> Products { get; set; }
    }
}
