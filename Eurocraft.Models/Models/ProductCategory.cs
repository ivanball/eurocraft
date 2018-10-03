using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductCategory")]
    public partial class ProductCategory : AuditableEntity
    {
        public ProductCategory()
        {
            ProductSubcategories = new HashSet<ProductSubcategory>();
        }

        [Column("ProductCategoryID")]
        public int ProductCategoryId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductCategoryName { get; set; }
        [Column("ProductMaterialID")]
        public int? ProductMaterialId { get; set; }
        [Column("ProductModelID")]
        public int? ProductModelId { get; set; }
        [Column("ProductTypeID")]
        public int ProductTypeId { get; set; }
        [Column("ProductUseID")]
        public int? ProductUseId { get; set; }

        [ForeignKey("ProductMaterialId")]
        [InverseProperty("ProductCategories")]
        public ProductMaterial ProductMaterial { get; set; }
        [ForeignKey("ProductModelId")]
        [InverseProperty("ProductCategories")]
        public ProductModel ProductModel { get; set; }
        [ForeignKey("ProductTypeId")]
        [InverseProperty("ProductCategories")]
        public ProductType ProductType { get; set; }
        [ForeignKey("ProductUseId")]
        [InverseProperty("ProductCategories")]
        public ProductUse ProductUse { get; set; }
        [InverseProperty("ProductCategory")]
        public ICollection<ProductSubcategory> ProductSubcategories { get; set; }
    }
}
