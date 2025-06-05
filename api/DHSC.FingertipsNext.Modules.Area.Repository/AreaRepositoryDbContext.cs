﻿using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepositoryDbContext : DbContext
{
    public AreaRepositoryDbContext()
    {
    }

    public AreaRepositoryDbContext(DbContextOptions<AreaRepositoryDbContext> options)
        : base(options)
    {
    }

    #region Required
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);
        modelBuilder.Entity<AreaRelationshipModel>()
            .HasKey(arm => new { arm.ParentAreaKey, arm.ChildAreaKey });

        modelBuilder.Entity<AreaModel>()
            .HasMany(area => area.Children)
            .WithMany(area => area.Parents)
            .UsingEntity<AreaRelationshipModel>
            (
               areaRelationship => areaRelationship.HasOne(x => x.Parent).WithMany().HasForeignKey(x => x.ChildAreaKey),
               areaRelationship => areaRelationship.HasOne(x => x.Child).WithMany().HasForeignKey(x => x.ParentAreaKey)
            );
    }
    #endregion

    public DbSet<AreaModel> Area { get; set; }
    public DbSet<AreaTypeModel> AreaType { get; set; }
    public DbSet<AreaRelationshipModel> AreaRelationship { get; set; }
    public DbSet<DenormalisedAreaWithAreaTypeModel> DenormalisedAreaWithAreaType { get; set; }
}



