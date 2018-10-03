using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public class PersonDto
    {
        //[Key]
        public int BusinessEntityId { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Suffix { get; set; }
        public string JobTitle { get; set; }
        public BusinessEntityDto BusinessEntity { get; set; } = new BusinessEntityDto();
    }
}
