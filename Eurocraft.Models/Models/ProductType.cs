using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ProductType")]
    public partial class ProductType : AuditableEntity
    {
        public ProductType()
        {
            ProductCategories = new HashSet<ProductCategory>();
        }

        [Column("ProductTypeID")]
        public int ProductTypeId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductTypeName { get; set; }

        [InverseProperty("ProductType")]
        public ICollection<ProductCategory> ProductCategories { get; set; }
    }
}
