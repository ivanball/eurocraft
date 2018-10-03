using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class BusinessEntityDto
    {
        //[Key]
        public int BusinessEntityId { get; set; }
        public IEnumerable<BusinessEntityAddressDto> Addresses { get; set; } = new List<BusinessEntityAddressDto>();
        public IEnumerable<BusinessEntityContactDto> Contacts { get; set; } = new List<BusinessEntityContactDto>();
        public IEnumerable<BusinessEntityEmailDto> EmailAddresses { get; set; } = new List<BusinessEntityEmailDto>();
        public IEnumerable<BusinessEntityPhoneDto> PhoneNumbers { get; set; } = new List<BusinessEntityPhoneDto>();
    }
}
