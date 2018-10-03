using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductCategoryDto
    {
        [Key]
        public int ProductCategoryId { get; set; }
        public string ProductCategoryName { get; set; }
        public int? ProductMaterialId { get; set; }
        public string ProductMaterialName { get; set; }
        public int? ProductModelId { get; set; }
        public string ProductModelName { get; set; }
        public int ProductTypeId { get; set; }
        public string ProductTypeName { get; set; }
        public int? ProductUseId { get; set; }
        public string ProductUseName { get; set; }
    }
}
