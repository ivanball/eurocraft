using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;

namespace Eurocraft.DataAccessLayer
{
    public partial class EurocraftContext : DbContext
    {
        public EurocraftContext()
        {
        }

        public EurocraftContext(DbContextOptions options)
            : base(options)
        {
        }

        public virtual DbSet<Address> Addresses { get; set; }
        public virtual DbSet<AddressType> AddressTypes { get; set; }
        public virtual DbSet<BillOfMaterial> BillOfMaterials { get; set; }
        public virtual DbSet<BusinessEntity> BusinessEntities { get; set; }
        public virtual DbSet<BusinessEntityAddress> BusinessEntityAddresses { get; set; }
        public virtual DbSet<BusinessEntityContact> BusinessEntityContacts { get; set; }
        public virtual DbSet<BusinessEntityEmail> BusinessEntityEmails { get; set; }
        public virtual DbSet<BusinessEntityPhone> BusinessEntityPhones { get; set; }
        public virtual DbSet<CountryRegion> CountryRegions { get; set; }
        public virtual DbSet<Dealer> Dealers { get; set; }
        public virtual DbSet<DealerType> DealerTypes { get; set; }
        public virtual DbSet<EntityDomain> EntityDomains { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<PaymentType> PaymentTypes { get; set; }
        public virtual DbSet<Person> Persons { get; set; }
        public virtual DbSet<PhoneNumberType> PhoneNumberTypes { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<ProductCategory> ProductCategories { get; set; }
        public virtual DbSet<ProductInventory> ProductInventories { get; set; }
        public virtual DbSet<ProductMaterial> ProductMaterials { get; set; }
        public virtual DbSet<ProductModel> ProductModels { get; set; }
        public virtual DbSet<ProductSubcategory> ProductSubcategories { get; set; }
        public virtual DbSet<ProductType> ProductTypes { get; set; }
        public virtual DbSet<ProductUse> ProductUses { get; set; }
        public virtual DbSet<ProductVendor> ProductVendors { get; set; }
        public virtual DbSet<PurchaseOrderDetail> PurchaseOrderDetails { get; set; }
        public virtual DbSet<PurchaseOrderHeader> PurchaseOrderHeaders { get; set; }
        public virtual DbSet<SalesOrderDetail> SalesOrderDetails { get; set; }
        public virtual DbSet<SalesOrderHeader> SalesOrderHeaders { get; set; }
        public virtual DbSet<ShipMethod> ShipMethods { get; set; }
        public virtual DbSet<StateProvince> StateProvinces { get; set; }
        public virtual DbSet<UnitMeasure> UnitMeasures { get; set; }
        public virtual DbSet<UserPermission> UserPermissions { get; set; }
        public virtual DbSet<UserProfile> UserProfiles { get; set; }
        public virtual DbSet<Vendor> Vendors { get; set; }
        public virtual DbSet<WorkOrder> WorkOrders { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Address>(entity =>
            {
                entity.Property(e => e.AddressCity).IsUnicode(false);

                entity.Property(e => e.AddressLine1).IsUnicode(false);

                entity.Property(e => e.AddressLine2).IsUnicode(false);

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.PostalCode).IsUnicode(false);

                entity.HasOne(d => d.StateProvince)
                    .WithMany(p => p.Addresses)
                    .HasForeignKey(d => d.StateProvinceId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<AddressType>(entity =>
            {
                entity.Property(e => e.AddressTypeName).IsUnicode(false);

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");
            });

            modelBuilder.Entity<BillOfMaterial>(entity =>
            {
                entity.HasKey(e => e.BillOfMaterialsId)
                    .ForSqlServerIsClustered(false);

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.HorizontalFormula).IsUnicode(false);

                entity.Property(e => e.VerticalFormula).IsUnicode(false);

                entity.HasOne(d => d.Component)
                    .WithMany(p => p.BillOfMaterialComponents)
                    .HasForeignKey(d => d.ComponentId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.ProductAssembly)
                    .WithMany(p => p.BillOfMaterialProductAssemblies)
                    .HasForeignKey(d => d.ProductAssemblyId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.UnitMeasure)
                    .WithMany(p => p.BillOfMaterials)
                    .HasForeignKey(d => d.UnitMeasureId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<BusinessEntity>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");
            });

            modelBuilder.Entity<BusinessEntityAddress>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.Address)
                    .WithMany(p => p.BusinessEntityAddresses)
                    .HasForeignKey(d => d.AddressId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.AddressType)
                    .WithMany(p => p.BusinessEntityAddresses)
                    .HasForeignKey(d => d.AddressTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.BusinessEntity)
                    .WithMany(p => p.BusinessEntityAddresses)
                    .HasForeignKey(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<BusinessEntityContact>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.BusinessEntity)
                    .WithMany(p => p.BusinessEntityContacts)
                    .HasForeignKey(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Person)
                    .WithMany(p => p.BusinessEntityContacts)
                    .HasForeignKey(d => d.PersonId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_BusinessEntityContact_Person_BusinessEntityID");
            });

            modelBuilder.Entity<BusinessEntityEmail>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.BusinessEntity)
                    .WithMany(p => p.BusinessEntityEmails)
                    .HasForeignKey(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<BusinessEntityPhone>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.PhoneNumber).IsUnicode(false);

                entity.HasOne(d => d.BusinessEntity)
                    .WithMany(p => p.BusinessEntityPhones)
                    .HasForeignKey(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.PhoneNumberType)
                    .WithMany(p => p.BusinessEntityPhones)
                    .HasForeignKey(d => d.PhoneNumberTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<CountryRegion>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CountryRegionCode).IsUnicode(false);

                entity.Property(e => e.CountryRegionName).IsUnicode(false);
            });

            modelBuilder.Entity<Dealer>(entity =>
            {
                entity.Property(e => e.BusinessEntityId).ValueGeneratedNever();

                entity.Property(e => e.AccountNumber).IsUnicode(false);

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.DealerName).IsUnicode(false);

                entity.Property(e => e.IsTaxExempt)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('N')");

                entity.Property(e => e.PaymentTerms).IsUnicode(false);

                entity.Property(e => e.Website).IsUnicode(false);

                entity.HasOne(d => d.BusinessEntity)
                    .WithOne(p => p.Dealer)
                    .HasForeignKey<Dealer>(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<DealerType>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.DealerTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<EntityDomain>(entity =>
            {
                entity.Property(e => e.EntityDomainName).IsUnicode(false);
            });

            modelBuilder.Entity<Location>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.LocationName).IsUnicode(false);
            });

            modelBuilder.Entity<PaymentType>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.PaymentTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<Person>(entity =>
            {
                entity.Property(e => e.BusinessEntityId).ValueGeneratedNever();

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.FirstName).IsUnicode(false);

                entity.Property(e => e.JobTitle).IsUnicode(false);

                entity.Property(e => e.LastName).IsUnicode(false);

                entity.Property(e => e.MiddleName).IsUnicode(false);

                entity.Property(e => e.Suffix).IsUnicode(false);

                entity.Property(e => e.Title).IsUnicode(false);

                entity.HasOne(d => d.BusinessEntity)
                    .WithOne(p => p.Person)
                    .HasForeignKey<Person>(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<PhoneNumberType>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.PhoneNumberTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductName).IsUnicode(false);

                entity.Property(e => e.ProductNumber).IsUnicode(false);

                entity.Property(e => e.SEMFormula).IsUnicode(false);
            });

            modelBuilder.Entity<ProductCategory>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductCategoryName).IsUnicode(false);

                entity.HasOne(d => d.ProductType)
                    .WithMany(p => p.ProductCategories)
                    .HasForeignKey(d => d.ProductTypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ProductInventory>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.Location)
                    .WithMany(p => p.ProductInventories)
                    .HasForeignKey(d => d.LocationId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductInventories)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ProductMaterial>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductMaterialName).IsUnicode(false);
            });

            modelBuilder.Entity<ProductModel>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductModelName).IsUnicode(false);
            });

            modelBuilder.Entity<ProductSubcategory>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductSubcategoryName).IsUnicode(false);

                entity.HasOne(d => d.ProductCategory)
                    .WithMany(p => p.ProductSubcategories)
                    .HasForeignKey(d => d.ProductCategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ProductType>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductTypeName).IsUnicode(false);
            });

            modelBuilder.Entity<ProductUse>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ProductUseName).IsUnicode(false);
            });

            modelBuilder.Entity<ProductVendor>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.BusinessEntity)
                    .WithMany(p => p.ProductVendors)
                    .HasForeignKey(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductVendors)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.UnitMeasure)
                    .WithMany(p => p.ProductVendors)
                    .HasForeignKey(d => d.UnitMeasureId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<PurchaseOrderDetail>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.LineTotal).HasComputedColumnSql("(isnull([OrderQty]*[UnitPrice],(0.00)))");

                entity.Property(e => e.StockedQty).HasComputedColumnSql("(isnull([ReceivedQty]-[RejectedQty],(0.00)))");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.PurchaseOrder)
                    .WithMany(p => p.PurchaseOrderDetails)
                    .HasForeignKey(d => d.PurchaseOrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<PurchaseOrderHeader>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Freight).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.OrderDate).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Status).HasDefaultValueSql("((1))");

                entity.Property(e => e.SubTotal).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.TaxAmt).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.TotalDue).HasComputedColumnSql("(isnull(([SubTotal]+[TaxAmt])+[Freight],(0)))");

                entity.HasOne(d => d.ShipMethod)
                    .WithMany(p => p.PurchaseOrderHeaders)
                    .HasForeignKey(d => d.ShipMethodId)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Vendor)
                    .WithMany(p => p.PurchaseOrderHeaders)
                    .HasForeignKey(d => d.VendorId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<SalesOrderDetail>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.CarrierTrackingNumber).IsUnicode(false);

                entity.Property(e => e.Color).IsUnicode(false);

                entity.Property(e => e.Glazing).IsUnicode(false);

                entity.Property(e => e.HandleColor).IsUnicode(false);

                entity.Property(e => e.LineTotal).HasComputedColumnSql("(isnull(([UnitPrice]*((1.0)-[UnitPriceDiscount]))*[OrderQty],(0.0)))");

                entity.HasOne(d => d.UnitMeasure)
                    .WithMany(p => p.SalesOrderDetails)
                    .HasForeignKey(d => d.UnitMeasureId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SalesOrderHeader>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.Comment).IsUnicode(false);

                entity.Property(e => e.Freight).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.OrderDate).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.SalesOrderNo).IsUnicode(false);

                entity.Property(e => e.Status).HasDefaultValueSql("((1))");

                entity.Property(e => e.SubTotal).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.TaxAmt).HasDefaultValueSql("((0.00))");

                entity.Property(e => e.TotalDue).HasComputedColumnSql("(isnull(([SubTotal]+[TaxAmt])+[Freight],(0)))");

                entity.HasOne(d => d.Dealer)
                    .WithMany(p => p.SalesOrderHeaders)
                    .HasForeignKey(d => d.DealerId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ShipMethod>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.ShipMethodName).IsUnicode(false);
            });

            modelBuilder.Entity<StateProvince>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.StateProvinceCode).IsUnicode(false);

                entity.Property(e => e.StateProvinceName).IsUnicode(false);

                entity.HasOne(d => d.CountryRegion)
                    .WithMany(p => p.StateProvinces)
                    .HasForeignKey(d => d.CountryRegionId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<UnitMeasure>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.UnitMeasureCode).IsUnicode(false);

                entity.Property(e => e.UnitMeasureName).IsUnicode(false);
            });

            modelBuilder.Entity<UserPermission>(entity =>
            {
                entity.Property(e => e.UserPermissionValue).IsUnicode(false);
            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.Property(e => e.Email).IsUnicode(false);

                entity.Property(e => e.FirstName).IsUnicode(false);

                entity.Property(e => e.LastName).IsUnicode(false);

                entity.Property(e => e.UserId).IsUnicode(false);
            });

            modelBuilder.Entity<Vendor>(entity =>
            {
                entity.Property(e => e.BusinessEntityId).ValueGeneratedNever();

                entity.Property(e => e.AccountNumber).IsUnicode(false);

                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.Property(e => e.IsTaxExempt)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('N')");

                entity.Property(e => e.PaymentTerms).IsUnicode(false);

                entity.Property(e => e.VendorName).IsUnicode(false);

                entity.Property(e => e.Website).IsUnicode(false);

                entity.HasOne(d => d.BusinessEntity)
                    .WithOne(p => p.Vendor)
                    .HasForeignKey<Vendor>(d => d.BusinessEntityId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<WorkOrder>(entity =>
            {
                entity.Property(e => e.AdmCreated).HasDefaultValueSql("(getdate())");

                entity.Property(e => e.AdmIsActive)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('Y')");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.WorkOrders)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });
        }
    }
}
