using System.ComponentModel.DataAnnotations;

namespace Eurocraft.Models
{
    public partial class UnitMeasureDto
    {
        [Key]
        public int UnitMeasureId { get; set; }
        public string UnitMeasureCode { get; set; }
        public string UnitMeasureName { get; set; }
    }
}
