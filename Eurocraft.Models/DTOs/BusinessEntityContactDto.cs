using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class BusinessEntityContactDto
    {
        //[Key]
        public int BusinessEntityContactId { get; set; }
        public int BusinessEntityId { get; set; }
        public int PersonId { get; set; }
        public PersonDto Person { get; set; } = new PersonDto();
    }
}
