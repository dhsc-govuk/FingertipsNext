using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class BatchHealthDataDbContext : DbContext
{
    public BatchHealthDataDbContext()
    {
    } 

    public BatchHealthDataDbContext(DbContextOptions options) : base(options)
    {
    }
    
    public DbSet<HealthMeasureModel> HealthMeasure { get; set; }
    public DbSet<IndicatorDimensionModel> IndicatorDimension { get; set; }
}