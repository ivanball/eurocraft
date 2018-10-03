using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("WorkOrder")]
    public partial class WorkOrder
    {
        [Column("WorkOrderID")]
        public int WorkOrderId { get; set; }
        [Column("ProductID")]
        public int ProductId { get; set; }
        public int OrderQty { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? EndDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime DueDate { get; set; }
        [Required]
        [StringLength(1)]
        public string AdmIsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AdmCreated { get; set; }
        public int AdmCreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? AdmModified { get; set; }
        public int? AdmModifiedBy { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("WorkOrders")]
        public Product Product { get; set; }
    }
}
