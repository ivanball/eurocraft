using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class BusinessEntityEmailDto
    {
        //[Key]
        public int BusinessEntityEmailId { get; set; }
        public int BusinessEntityId { get; set; }
        public string EmailAddress { get; set; }
    }
}
