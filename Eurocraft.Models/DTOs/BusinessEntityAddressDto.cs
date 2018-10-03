using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class BusinessEntityAddressDto
    {
        //[Key]
        public int BusinessEntityAddressId { get; set; }
        public int BusinessEntityId { get; set; }
        public int AddressId { get; set; }
        public int AddressTypeId { get; set; }
        public AddressDto Address { get; set; } = new AddressDto();
    }
}
