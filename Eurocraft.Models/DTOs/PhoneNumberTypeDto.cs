using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class PhoneNumberTypeDto
    {
        [Key]
        public int PhoneNumberTypeId { get; set; }
        public string PhoneNumberTypeName { get; set; }
    }
}
