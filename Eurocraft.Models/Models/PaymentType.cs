using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("PaymentType")]
    public partial class PaymentType : AuditableEntity
    {
        public PaymentType()
        {
            SalesOrderHeaders = new HashSet<SalesOrderHeader>();
        }

        [Column("PaymentTypeID")]
        public int PaymentTypeId { get; set; }
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string PaymentTypeName { get; set; }

        [InverseProperty("PaymentType")]
        public ICollection<SalesOrderHeader> SalesOrderHeaders { get; set; }
    }
}
