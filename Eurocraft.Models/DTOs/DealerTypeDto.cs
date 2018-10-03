using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class DealerTypeDto
    {
        [Key]
        public int DealerTypeId { get; set; }
        public string DealerTypeName { get; set; }
    }
}
