using DHSC.FingertipsNext.Modules.Core.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public sealed class HealthMeasureService : IHealthMeasureService
    {
        private readonly RepositoryDbContext _dbContext;

        public HealthMeasureService(RepositoryDbContext repositoryDbContext)
        {
            _dbContext = repositoryDbContext ?? throw new ArgumentNullException(nameof(repositoryDbContext));
        }

        public  HealthMeasure GetFirstHealthMeasure()
        {
            var query = (from hm in _dbContext.HealthMeasure
                orderby hm.HealthMeasureKey
                select hm).First();

            return query;
        }
    }
}
