using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class BusinessEntityPhoneDto
    {
        //[Key]
        public int BusinessEntityPhoneId { get; set; }
        public int BusinessEntityId { get; set; }
        public string PhoneNumber { get; set; }
        public int PhoneNumberTypeId { get; set; }
    }
}
