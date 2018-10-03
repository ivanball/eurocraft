using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("BusinessEntityContact")]
    public partial class BusinessEntityContact : AuditableEntity
    {
        [Column("BusinessEntityContactID")]
        public int BusinessEntityContactId { get; set; }
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [Column("PersonID")]
        public int PersonId { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("BusinessEntityContacts")]
        public BusinessEntity BusinessEntity { get; set; }
        [ForeignKey("PersonId")]
        [InverseProperty("BusinessEntityContacts")]
        public Person Person { get; set; }
    }
}
