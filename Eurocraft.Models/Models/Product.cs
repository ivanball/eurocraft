using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Eurocraft.Models
{
    [Table("Product")]
    public partial class Product : AuditableEntity
    {
        public Product()
        {
            BillOfMaterialComponents = new HashSet<BillOfMaterial>();
            BillOfMaterialProductAssemblies = new HashSet<BillOfMaterial>();
            ProductInventories = new HashSet<ProductInventory>();
            ProductVendors = new HashSet<ProductVendor>();
            PurchaseOrderDetails = new HashSet<PurchaseOrderDetail>();
            SalesOrderDetails = new HashSet<SalesOrderDetail>();
            WorkOrders = new HashSet<WorkOrder>();
        }

        [Column("ProductID")]
        public int ProductId { get; set; }
        [Required]
        [Column(TypeName = "Name")]
        [StringLength(590)]
        public string ProductName { get; set; }
        [Required]
        [StringLength(25)]
        public string ProductNumber { get; set; }
        [Column("ProductSubcategoryID")]
        public int? ProductSubcategoryId { get; set; }
        [Column("SEMFormula")]
        [StringLength(500)]
        public string SEMFormula { get; set; }

        [ForeignKey("ProductSubcategoryId")]
        [InverseProperty("Products")]
        public ProductSubcategory ProductSubcategory { get; set; }
        [InverseProperty("Component")]
        public ICollection<BillOfMaterial> BillOfMaterialComponents { get; set; }
        [InverseProperty("ProductAssembly")]
        public ICollection<BillOfMaterial> BillOfMaterialProductAssemblies { get; set; }
        [InverseProperty("Product")]
        public ICollection<ProductInventory> ProductInventories { get; set; }
        [InverseProperty("Product")]
        public ICollection<ProductVendor> ProductVendors { get; set; }
        [InverseProperty("Product")]
        public ICollection<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
        [InverseProperty("Product")]
        public ICollection<SalesOrderDetail> SalesOrderDetails { get; set; }
        [InverseProperty("Product")]
        public ICollection<WorkOrder> WorkOrders { get; set; }
    }
}
