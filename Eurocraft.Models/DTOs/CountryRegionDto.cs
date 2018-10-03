using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class CountryRegionDto
    {
        [Key]
        public int CountryRegionId { get; set; }
        public string CountryRegionCode { get; set; }
        public string CountryRegionName { get; set; }
    }
}
