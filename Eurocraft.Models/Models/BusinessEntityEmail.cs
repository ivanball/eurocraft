using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("BusinessEntityEmail")]
    public partial class BusinessEntityEmail : AuditableEntity
    {
        [Column("BusinessEntityEmailID")]
        public int BusinessEntityEmailId { get; set; }
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [StringLength(50)]
        public string EmailAddress { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("BusinessEntityEmails")]
        public BusinessEntity BusinessEntity { get; set; }
    }
}
