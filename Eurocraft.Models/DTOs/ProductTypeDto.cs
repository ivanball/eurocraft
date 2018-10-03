using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class ProductTypeDto
    {
        [Key]
        public int ProductTypeId { get; set; }
        public string ProductTypeName { get; set; }
    }
}
