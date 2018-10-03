using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class AddressDto
    {
        //[Key]
        public int AddressId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressCity { get; set; }
        public int? StateProvinceId { get; set; }
        public string PostalCode { get; set; }
    }
}
