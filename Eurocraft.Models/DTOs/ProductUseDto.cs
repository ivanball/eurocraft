using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductUseDto
    {
        [Key]
        public int ProductUseId { get; set; }
        public string ProductUseName { get; set; }
    }
}
