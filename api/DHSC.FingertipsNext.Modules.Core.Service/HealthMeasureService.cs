using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Repository;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public sealed class HealthMeasureService : IHealthMeasureService
    {
        private readonly RepositoryDbContext dbContext;

        public HealthMeasureService(RepositoryDbContext repositoryDbContext)
        {
            this.dbContext = repositoryDbContext ?? throw new ArgumentNullException(nameof(repositoryDbContext));
        }

        public async Task<HealthMeasure> GetFirstHealthMeasure()
        {
            var healthMeasures = await dbContext.HealthMeasures.ToListAsync();
            return healthMeasures.First();
        }
    }
}
