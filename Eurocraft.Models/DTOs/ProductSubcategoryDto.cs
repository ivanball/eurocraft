using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductSubcategoryDto
    {
        [Key]
        public int ProductSubcategoryId { get; set; }
        public string ProductSubcategoryName { get; set; }
        public int ProductCategoryId { get; set; }
        public string ProductCategoryName { get; set; }
    }
}
