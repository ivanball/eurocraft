using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class AddressTypeDto
    {
        [Key]
        public int AddressTypeId { get; set; }
        public string AddressTypeName { get; set; }
    }
}
