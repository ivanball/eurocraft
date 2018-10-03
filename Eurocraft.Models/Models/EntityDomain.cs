using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("EntityDomain")]
    public partial class EntityDomain
    {
        [Column("EntityDomainID")]
        public int EntityDomainId { get; set; }
        [StringLength(100)]
        public string EntityDomainName { get; set; }
    }
}
