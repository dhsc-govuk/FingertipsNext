using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class HealthDataDbContext : DbContext
{
    public HealthDataDbContext()
    {
    }

    public HealthDataDbContext(DbContextOptions<HealthDataDbContext> options)
        : base(options)
    {
    }

    public DbSet<HealthMeasureModel> HealthMeasure { get; set; }
    public DbSet<AreaDimensionModel> AreaDimension { get; set; }
    public DbSet<IndicatorDimensionModel> IndicatorDimension { get; set; }
    public DbSet<AgeDimensionModel> AgeDimension { get; set; }
    public DbSet<SexDimensionModel> SexDimension { get; set; }
    public DbSet<DateDimensionModel> DateDimension { get; set; }
    public DbSet<PeriodDimensionModel> PeriodDimension { get; set; }
    public DbSet<TrendDimensionModel> TrendDimension { get; set; }
    public DbSet<DeprivationDimensionModel> DeprivationDimension { get; set; }
    public DbSet<DenormalisedHealthMeasureModel> DenormalisedHealthMeasure { get; set; }
    public DbSet<QuartileDataModel> QuartileData { get; set; }

    public IQueryable<HealthMeasureModel> GetHealthMeasures(bool includeUnpublished)
    {
        if (includeUnpublished)
            return HealthMeasure;
        return HealthMeasure.Where(hm => hm.PublishedAt <= DateTime.UtcNow);
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ArgumentNullException.ThrowIfNull(modelBuilder);
        modelBuilder.Entity<QuartileDataModel>()
            .HasKey(q => new { q.IndicatorId, q.SexName });
    }

}
