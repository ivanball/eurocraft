using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("DealerType")]
    public partial class DealerType : AuditableEntity
    {
        public DealerType()
        {
            Dealers = new HashSet<Dealer>();
        }

        [Column("DealerTypeID")]
        public int DealerTypeId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string DealerTypeName { get; set; }

        [InverseProperty("DealerType")]
        public ICollection<Dealer> Dealers { get; set; }
    }
}
