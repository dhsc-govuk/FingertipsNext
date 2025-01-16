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
}