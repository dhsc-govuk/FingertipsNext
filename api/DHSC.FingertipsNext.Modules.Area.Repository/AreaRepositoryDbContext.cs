using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Types;

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
         modelBuilder.Entity<AreaRelationshipModel>()
             .HasKey(arm => new {arm.ParentAreaKey, arm.ChildAreaKey});

         modelBuilder.Entity<AreaModel>()
             .HasMany(x => x.Children)
             .WithMany(x => x.Parents)
             .UsingEntity<AreaRelationshipModel>(
         l => l.HasOne<AreaModel>(x=>x.Parent).WithMany().HasForeignKey(x => x.ChildAreaKey),
         l => l.HasOne<AreaModel>(x=>x.Child).WithMany().HasForeignKey(x => x.ParentAreaKey)
         );
    }
    #endregion
    
    public DbSet<AreaModel> Area { get; set; }
    public DbSet<AreaTypeModel> AreaType { get; set; }
    public DbSet<AreaRelationshipModel> AreaRelationship { get; set; }
    public DbSet<DenormalisedAreaWithAreaTypeModel> DenormalisedAreaWithAreaType { get; set; }
}



