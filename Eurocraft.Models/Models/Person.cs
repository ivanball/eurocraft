using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Person")]
    public partial class Person : AuditableEntity
    {
        public Person()
        {
            BusinessEntityContacts = new HashSet<BusinessEntityContact>();
        }

        [Key]
        [Column("BusinessEntityID")]
        public int BusinessEntityId { get; set; }
        [StringLength(8)]
        public string Title { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string FirstName { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string MiddleName { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string LastName { get; set; }
        [StringLength(10)]
        public string Suffix { get; set; }
        [StringLength(100)]
        public string JobTitle { get; set; }

        [ForeignKey("BusinessEntityId")]
        [InverseProperty("Person")]
        public BusinessEntity BusinessEntity { get; set; }
        [InverseProperty("Person")]
        public ICollection<BusinessEntityContact> BusinessEntityContacts { get; set; }
    }
}
