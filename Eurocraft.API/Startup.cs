using System.Linq;
using Eurocraft.DataAccessLayer;
using Eurocraft.DataAccessLayer.Services;
using Eurocraft.Models;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Edm;
using Newtonsoft.Json.Serialization;

namespace Eurocraft.API
{
    public class Startup
    {
        private IHostingEnvironment Environment { get; set; }

        public Startup(IHostingEnvironment environment, IConfiguration configuration)
        {
            Environment = environment;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
            });

            services.AddLogging(builder =>
            {
                builder.SetMinimumLevel(LogLevel.Trace);
                builder.AddFilter("Microsoft", LogLevel.Warning);
                builder.AddFilter("System", LogLevel.Error);
                builder.AddFilter("Engine", LogLevel.Warning);
            });

            services.AddDbContext<AuditableContext>(options => options.UseSqlServer(Configuration.GetConnectionString("EurocraftConnection")));
            services.AddScoped<IAccountRepository, AccountRepository>();
            services.AddScoped<IAddressTypeRepository, AddressTypeRepository>();
            services.AddScoped<IBillOfMaterialRepository, BillOfMaterialRepository>();
            services.AddScoped<ICountryRegionRepository, CountryRegionRepository>();
            services.AddScoped<IDealerRepository, DealerRepository>();
            services.AddScoped<IDealerTypeRepository, DealerTypeRepository>();
            services.AddScoped<IPaymentTypeRepository, PaymentTypeRepository>();
            services.AddScoped<IPhoneNumberTypeRepository, PhoneNumberTypeRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IProductCategoryRepository, ProductCategoryRepository>();
            services.AddScoped<IProductMaterialRepository, ProductMaterialRepository>();
            services.AddScoped<IProductModelRepository, ProductModelRepository>();
            services.AddScoped<IProductSubcategoryRepository, ProductSubcategoryRepository>();
            services.AddScoped<IProductTypeRepository, ProductTypeRepository>();
            services.AddScoped<IProductUseRepository, ProductUseRepository>();
            services.AddScoped<ISalesOrderDetailRepository, SalesOrderDetailRepository>();
            services.AddScoped<ISalesOrderHeaderRepository, SalesOrderHeaderRepository>();
            services.AddScoped<IStateProvinceRepository, StateProvinceRepository>();
            services.AddScoped<IUnitMeasureRepository, UnitMeasureRepository>();
            services.AddScoped<IVendorRepository, VendorRepository>();

            if (Environment.IsEnvironment("Production"))
            {
                services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                     .AddJwtBearer(options =>
                     {
                         options.Authority = "http://localhost:8080/eurocraftsts";
                         options.RequireHttpsMetadata = false;
                         options.Audience = "eurocraft-api";
                         options.TokenValidationParameters = new TokenValidationParameters()
                         {
                             ValidateIssuer = false
                         };
                     });
            }
            else
            {
                services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.Authority = "http://localhost:4242/";
                        options.RequireHttpsMetadata = false;
                        options.Audience = "eurocraft-api";
                        options.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuer = false
                        };
                    });
            }

            services.AddCors(options =>
            {
                options.AddPolicy("AllRequests", builder =>
                {
                    builder.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowAnyOrigin()
                    .AllowCredentials();
                });
            });

            services.AddOData();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddJsonOptions(o => {
                    if (o.SerializerSettings.ContractResolver != null)
                    {
                        var castedResolver = o.SerializerSettings.ContractResolver as DefaultContractResolver;
                        castedResolver.NamingStrategy = null;
                    }
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddEventLog();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            app.UseStatusCodePages();

            AutoMapper.Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<Models.Address, Models.AddressDto>().ReverseMap();
                cfg.CreateMap<Models.AddressType, Models.AddressTypeDto>().ReverseMap();
                cfg.CreateMap<Models.BusinessEntityEmail, Models.BusinessEntityEmailDto>().ReverseMap();
                cfg.CreateMap<Models.BusinessEntityPhone, Models.BusinessEntityPhoneDto>().ReverseMap();
                cfg.CreateMap<Models.CountryRegion, Models.CountryRegionDto>().ReverseMap();
                cfg.CreateMap<Models.DealerType, Models.DealerTypeDto>().ReverseMap();
                cfg.CreateMap<Models.PaymentType, Models.PaymentTypeDto>().ReverseMap();
                cfg.CreateMap<Models.Person, Models.PersonDto>().ReverseMap();
                cfg.CreateMap<Models.PhoneNumberType, Models.PhoneNumberTypeDto>().ReverseMap();
                cfg.CreateMap<Models.ProductMaterial, Models.ProductMaterialDto>().ReverseMap();
                cfg.CreateMap<Models.ProductModel, Models.ProductModelDto>().ReverseMap();
                cfg.CreateMap<Models.ProductType, Models.ProductTypeDto>().ReverseMap();
                cfg.CreateMap<Models.ProductUse, Models.ProductUseDto>().ReverseMap();
                cfg.CreateMap<Models.UnitMeasure, Models.UnitMeasureDto>().ReverseMap();

                cfg.CreateMap<Models.BillOfMaterial, Models.BillOfMaterialDto>()
                    .ForMember(destination => destination.ProductAssemblyName, opts => opts.MapFrom(source => source.ProductAssembly.ProductName))
                    .ForMember(destination => destination.ComponentName, opts => opts.MapFrom(source => source.Component.ProductName))
                    .ForMember(destination => destination.UnitMeasureName, opts => opts.MapFrom(source => source.UnitMeasure.UnitMeasureName));
                cfg.CreateMap<Models.BillOfMaterialDto, Models.BillOfMaterial>()
                    .ForPath(destination => destination.ProductAssembly, opts => opts.Ignore())
                    .ForPath(destination => destination.Component, opts => opts.Ignore())
                    .ForPath(destination => destination.UnitMeasure, opts => opts.Ignore());

                cfg.CreateMap<Models.BusinessEntity, Models.BusinessEntityDto>()
                    .ForMember(destination => destination.Addresses, opts => opts.MapFrom(source => source.BusinessEntityAddresses))
                    .ForMember(destination => destination.Contacts, opts => opts.MapFrom(source => source.BusinessEntityContacts))
                    .ForMember(destination => destination.EmailAddresses, opts => opts.MapFrom(source => source.BusinessEntityEmails))
                    .ForMember(destination => destination.PhoneNumbers, opts => opts.MapFrom(source => source.BusinessEntityPhones))
                    .ReverseMap();

                cfg.CreateMap<Models.BusinessEntityAddress, Models.BusinessEntityAddressDto>()
                    .ForMember(destination => destination.Address, opts => opts.MapFrom(source => source.Address))
                    .ReverseMap();

                cfg.CreateMap<Models.BusinessEntityContact, Models.BusinessEntityContactDto>()
                    .ForMember(destination => destination.Person, opts => opts.MapFrom(source => source.Person))
                    .ReverseMap();

                cfg.CreateMap<Models.Dealer, Models.DealerDto>()
                    .ForMember(destination => destination.BusinessEntity, opts => opts.MapFrom(source => source.BusinessEntity))
                    .ForMember(destination => destination.PhoneNumber, opts => opts.MapFrom(source => source.BusinessEntity.BusinessEntityPhones.FirstOrDefault().PhoneNumber))
                    .ForMember(destination => destination.AddressCity, opts => opts.MapFrom(source => source.BusinessEntity.BusinessEntityAddresses.FirstOrDefault().Address.AddressCity));
                cfg.CreateMap<Models.DealerDto, Models.Dealer>()
                    .ForPath(destination => destination.BusinessEntity, opts => opts.MapFrom(source => source.BusinessEntity))
                    .ForPath(destination => destination.DealerType, opts => opts.Ignore());
                    //.ForPath(destination => destination.PaymentType, opts => opts.Ignore());

                cfg.CreateMap<Models.Product, Models.ProductDto>()
                    .ForMember(destination => destination.ProductCategoryId, opts => opts.MapFrom(source => source.ProductSubcategory.ProductCategoryId))
                    .ForMember(destination => destination.ProductCategoryName, opts => opts.MapFrom(source => source.ProductSubcategory.ProductCategory.ProductCategoryName))
                    .ForMember(destination => destination.ProductSubcategoryName, opts => opts.MapFrom(source => source.ProductSubcategory.ProductSubcategoryName));
                cfg.CreateMap<Models.ProductDto, Models.Product>()
                    .ForPath(destination => destination.ProductSubcategory, opts => opts.Ignore());

                cfg.CreateMap<Models.ProductCategory, Models.ProductCategoryDto>()
                    .ForMember(destination => destination.ProductMaterialName, opts => opts.MapFrom(source => source.ProductMaterial.ProductMaterialName))
                    .ForMember(destination => destination.ProductModelName, opts => opts.MapFrom(source => source.ProductModel.ProductModelName))
                    .ForMember(destination => destination.ProductTypeName, opts => opts.MapFrom(source => source.ProductType.ProductTypeName))
                    .ForMember(destination => destination.ProductUseName, opts => opts.MapFrom(source => source.ProductUse.ProductUseName));
                cfg.CreateMap<Models.ProductCategoryDto, Models.ProductCategory>();

                cfg.CreateMap<Models.ProductSubcategory, Models.ProductSubcategoryDto>()
                    .ForMember(destination => destination.ProductCategoryName, opts => opts.MapFrom(source => source.ProductCategory.ProductCategoryName));
                cfg.CreateMap<Models.ProductSubcategoryDto, Models.ProductSubcategory>();

                cfg.CreateMap<Models.SalesOrderDetail, Models.SalesOrderDetailDto>()
                    .ForMember(destination => destination.ProductName, opts => opts.MapFrom(source => source.Product.ProductName));
                cfg.CreateMap<Models.SalesOrderDetailDto, Models.SalesOrderDetail>();

                cfg.CreateMap<Models.SalesOrderHeader, Models.SalesOrderHeaderDto>()
                    .ForMember(destination => destination.DealerName, opts => opts.MapFrom(source => source.Dealer.DealerName))
                    .ForMember(destination => destination.PaymentTypeName, opts => opts.MapFrom(source => source.PaymentType.PaymentTypeName));
                cfg.CreateMap<Models.SalesOrderHeaderDto, Models.SalesOrderHeader>();

                cfg.CreateMap<Models.StateProvince, Models.StateProvinceDto>()
                    .ForMember(destination => destination.CountryRegionName, opts => opts.MapFrom(source => source.CountryRegion.CountryRegionName));
                cfg.CreateMap<Models.StateProvinceDto, Models.StateProvince>();

                cfg.CreateMap<Models.Vendor, Models.VendorDto>()
                    .ForMember(destination => destination.BusinessEntity, opts => opts.MapFrom(source => source.BusinessEntity))
                    .ForMember(destination => destination.PhoneNumber, opts => opts.MapFrom(source => source.BusinessEntity.BusinessEntityPhones.FirstOrDefault().PhoneNumber))
                    .ForMember(destination => destination.AddressCity, opts => opts.MapFrom(source => source.BusinessEntity.BusinessEntityAddresses.FirstOrDefault().Address.AddressCity));
                cfg.CreateMap<Models.VendorDto, Models.Vendor>()
                    .ForPath(destination => destination.BusinessEntity, opts => opts.MapFrom(source => source.BusinessEntity));
                    //.ForPath(destination => destination.PaymentType, opts => opts.Ignore());
            });

            //app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            app.UseCors("AllRequests");
            app.UseAuthentication();
            app.UseMvc(b =>
            {
                b.Select().Expand().Filter().OrderBy().MaxTop(100).Count();
                b.MapODataServiceRoute("odata", "odata", GetEdmModel());
            });
        }

        private static IEdmModel GetEdmModel()
        {
            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.Namespace = "Eurocraft";
            builder.ContainerName = "Eurocraft.Container";

            builder.EntitySet<Address>("Addresses");
            builder.EntitySet<AddressTypeDto>("AddressTypes");
            builder.EntitySet<BillOfMaterialDto>("BillOfMaterials");
            builder.EntitySet<BusinessEntity>("BusinessEntities");
            builder.EntitySet<BusinessEntityAddress>("BusinessEntityAddresses");
            builder.EntitySet<BusinessEntityContact>("BusinessEntityContacts");
            builder.EntitySet<BusinessEntityEmail>("BusinessEntityEmails");
            builder.EntitySet<BusinessEntityPhone>("BusinessEntityPhones");
            builder.EntitySet<CountryRegionDto>("CountryRegions");
            builder.EntitySet<DealerDto>("Dealers");
            builder.EntitySet<DealerTypeDto>("DealerTypes");
            builder.EntitySet<EntityDomain>("EntityDomains");
            builder.EntitySet<Location>("Locations");
            builder.EntitySet<PaymentTypeDto>("PaymentTypes");
            builder.EntitySet<Person>("Persons");
            builder.EntitySet<PhoneNumberTypeDto>("PhoneNumberTypes");
            builder.EntitySet<ProductDto>("Products");
            builder.EntitySet<ProductCategoryDto>("ProductCategories");
            builder.EntitySet<ProductInventory>("ProductInventories");
            builder.EntitySet<ProductMaterialDto>("ProductMaterials");
            builder.EntitySet<ProductModelDto>("ProductModels");
            builder.EntitySet<ProductSubcategoryDto>("ProductSubcategories");
            builder.EntitySet<ProductTypeDto>("ProductTypes");
            builder.EntitySet<ProductUseDto>("ProductUses");
            builder.EntitySet<ProductVendor>("ProductVendors");
            builder.EntitySet<PurchaseOrderDetail>("PurchaseOrderDetails");
            builder.EntitySet<PurchaseOrderHeader>("PurchaseOrderHeaders");
            builder.EntitySet<SalesOrderDetailDto>("SalesOrderDetails");
            builder.EntitySet<SalesOrderHeaderDto>("SalesOrderHeaders");
            builder.EntitySet<ShipMethod>("ShipMethods");
            builder.EntitySet<StateProvinceDto>("StateProvinces");
            builder.EntitySet<UnitMeasureDto>("UnitMeasures");
            builder.EntitySet<UserPermission>("UserPermissions");
            builder.EntitySet<UserProfile>("UserProfiles");
            builder.EntitySet<VendorDto>("Vendors");
            builder.EntitySet<WorkOrder>("WorkOrders");

            return builder.GetEdmModel();
        }
    }
}
