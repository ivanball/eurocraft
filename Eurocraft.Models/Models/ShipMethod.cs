using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("ShipMethod")]
    public partial class ShipMethod
    {
        public ShipMethod()
        {
            PurchaseOrderHeaders = new HashSet<PurchaseOrderHeader>();
            SalesOrderHeaders = new HashSet<SalesOrderHeader>();
        }

        [Column("ShipMethodID")]
        public int ShipMethodId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ShipMethodName { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [InverseProperty("ShipMethod")]
        public ICollection<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
        [InverseProperty("ShipMethod")]
        public ICollection<SalesOrderHeader> SalesOrderHeaders { get; set; }
    }
}
