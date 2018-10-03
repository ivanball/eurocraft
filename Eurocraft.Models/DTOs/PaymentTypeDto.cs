using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class PaymentTypeDto
    {
        [Key]
        public int PaymentTypeId { get; set; }
        public string PaymentTypeName { get; set; }
    }
}
