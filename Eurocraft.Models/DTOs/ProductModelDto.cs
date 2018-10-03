using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductModelDto
    {
        [Key]
        public int ProductModelId { get; set; }
        public string ProductModelName { get; set; }
    }
}
