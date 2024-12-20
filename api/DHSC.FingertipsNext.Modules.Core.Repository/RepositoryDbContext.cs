using DHSC.FingertipsNext.Modules.Core.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Core.Repository
{
    public class RepositoryDbContext : DbContext
    {

        public RepositoryDbContext() 
        {
        }

        public RepositoryDbContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<HealthMeasure> HealthMeasure {  get; set; }
        public DbSet<AgeDimension> AgeDimension {  get; set; }
        public DbSet<AreaDimension> AreaDimension {  get; set; }
        public DbSet<IndicatorDimension> IndicatorDimension {  get; set; }
        public DbSet<SexDimension> SexDimension {  get; set; }
    }


}
