using TrendAnalysisApp.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureDbContext : DbContext
{
    public HealthMeasureDbContext() {}

    public HealthMeasureDbContext(DbContextOptions options) : base(options) {}

    public DbSet<HealthMeasureModel> HealthMeasure { get; set; }
    public DbSet<AreaDimensionModel> AreaDimension { get; set; }
    public DbSet<IndicatorDimensionModel> IndicatorDimension { get; set; }
    public DbSet<AgeDimensionModel> AgeDimension { get; set; }
    public DbSet<SexDimensionModel> SexDimension { get; set; }
    public DbSet<TrendDimensionModel> TrendDimension { get; set; }
}
