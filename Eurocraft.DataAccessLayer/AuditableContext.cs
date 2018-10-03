using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Remotion.Linq.Parsing.ExpressionVisitors;
using System;
using System.Linq;
using System.Linq.Expressions;

namespace Eurocraft.DataAccessLayer
{
    public class AuditableContext : EurocraftContext
    {
        public AuditableContext(DbContextOptions options)
            : base(options)
        {
        }

        private static LambdaExpression ConvertFilterExpression<TInterface>(
                                    Expression<Func<TInterface, bool>> filterExpression,
                                    Type entityType)
        {
            var newParam = Expression.Parameter(entityType);
            var newBody = ReplacingExpressionVisitor.Replace(filterExpression.Parameters.Single(), newParam, filterExpression.Body);

            return Expression.Lambda(newBody, newParam);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Global filter to get only entities where AdmIsActive = "Y"
            modelBuilder.Model.GetEntityTypes()
                                   .Where(entityType => typeof(IAuditableEntity).IsAssignableFrom(entityType.ClrType))
                                   .ToList()
                                   .ForEach(entityType =>
                                   {
                                       modelBuilder.Entity(entityType.ClrType)
                                       .HasQueryFilter(ConvertFilterExpression<IAuditableEntity>(e => e.AdmIsActive == "Y", entityType.ClrType));
                                   });
        }

        private void HandleEntry(EntityEntry entry, int userId)
        {
            if (entry.Entity is IAuditableEntity)
            {
                var entity = entry.Entity as AuditableEntity;

                switch (entry.State)
                {
                    case EntityState.Added:
                        {
                            entity.AdmIsActive = "Y";
                            entity.AdmCreated = DateTime.Now;
                            entity.AdmCreatedBy = userId;
                            break;
                        }
                    case EntityState.Modified:
                        {
                            if (entity.AdmIsActive != "N")
                            {
                                entity.AdmIsActive = "Y";
                                entity.AdmModified = DateTime.Now;
                                entity.AdmModifiedBy = userId;
                            }
                            break;
                        }
                    case EntityState.Deleted:
                        {
                            entity.AdmIsActive = "N";
                            entity.AdmModified = DateTime.Now;
                            entity.AdmModifiedBy = userId;
                            entry.State = EntityState.Modified;
                            break;
                        }
                }
            }
            foreach (var navigationEntry in entry.Navigations.Where(n => !n.Metadata.IsDependentToPrincipal()))
            {
                if (navigationEntry is CollectionEntry collectionEntry)
                {
                    foreach (var dependentEntry in collectionEntry.CurrentValue)
                    {
                        HandleEntry(Entry(dependentEntry), userId);
                    }
                }
                else
                {
                    var dependentEntry = navigationEntry.CurrentValue;
                    if (dependentEntry != null)
                    {
                        HandleEntry(Entry(dependentEntry), userId);
                    }
                }
            }
        }

        public int SaveChanges(int userId)
        {
            var modifiedEntries = ChangeTracker.Entries<IAuditableEntity>()
                    .Where(x => (x.State == EntityState.Added || x.State == EntityState.Modified || x.State == EntityState.Deleted));

            foreach (var entry in modifiedEntries)
            {
                HandleEntry(entry, userId);
            }

            return base.SaveChanges();
        }
    }
}
