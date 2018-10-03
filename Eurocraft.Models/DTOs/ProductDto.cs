using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class ProductDto
    {
        [Key]
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductNumber { get; set; }
        public int? ProductCategoryId { get; set; }
        public string ProductCategoryName { get; set; }
        public int? ProductSubcategoryId { get; set; }
        public string ProductSubcategoryName { get; set; }
        public string SEMFormula { get; set; }
    }
}
