using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class StateProvinceDto
    {
        [Key]
        public int StateProvinceId { get; set; }
        public string StateProvinceCode { get; set; }
        public string StateProvinceName { get; set; }
        public int CountryRegionId { get; set; }
        public string CountryRegionName { get; set; }
    }
}
