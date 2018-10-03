using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductMaterialDto
    {
        [Key]
        public int ProductMaterialId { get; set; }
        public string ProductMaterialName { get; set; }
    }
}
