using System.ComponentModel.DataAnnotations;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
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

    public DbSet<AreaDimensionModel> AreaDimension { get; set; }
    public DbSet<AreaModel> Area { get; set; }
}


[Serializable]
public class AreaModel
{
    [Key]
    public required byte[] Node { get; set; }
    public int Level { get; set; }
    [MaxLength(20)]
    public required string AreaCode { get; set; }
    [MaxLength(255)]
    public required string AreaName { get; set; }
    public required string AreaType { get; set; }
    public required string HierarchyType { get; set; }
}
