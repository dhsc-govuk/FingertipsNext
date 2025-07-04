using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public class DataManagementDbContext : DbContext
{
    public DataManagementDbContext()
    {
    }

    public DataManagementDbContext(DbContextOptions options) : base(options)
    {
    }

    #region Required

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);
        modelBuilder.Entity<BatchModel>()
            .Property(b => b.Status)
            .HasConversion<string>();
    }

    #endregion

    public DbSet<BatchModel> Batch { get; set; }

}