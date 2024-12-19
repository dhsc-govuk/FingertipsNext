using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Core.Repository.Dimensions.Models;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public sealed class HealthMeasureService : IHealthMeasureService
    {
        private readonly RepositoryDbContext _dbContext;

        public HealthMeasureService(RepositoryDbContext repositoryDbContext)
        {
            _dbContext = repositoryDbContext ?? throw new ArgumentNullException(nameof(repositoryDbContext));
        }

        public  HealthMeasure? GetFirstHealthMeasure()
        {
            var query = from healthMeasure in _dbContext.HealthMeasure
                orderby healthMeasure.HealthMeasureKey
                select healthMeasure;

            
            // TODO JH - add a separate schema for a populated health measure with the dimensions below  
            return query.FirstOrDefault();
        }

        private AgeDimension? _GetAgeDimension(short id)
        {
            var query = from dimension in _dbContext.AgeDimension
                where dimension.AgeKey == id
                select dimension;
            
            return query.FirstOrDefault();
        }

        private AreaDimension? _GetAreaDimension(int id)
        {
            var query = from dimension in _dbContext.AreaDimension
                where dimension.AreaKey == id
                select dimension;
            
            return query.FirstOrDefault();
        }

        private IndicatorDimension? _GetIndicatorDimension(int id)
        {
            var query = from dimension in _dbContext.IndicatorDimension
                where dimension.IndicatorKey == id
                select dimension;
            
            return query.FirstOrDefault();
        }

        private SexDimension? _GetSexDimension(byte id)
        {
            var query = from dimension in _dbContext.SexDimension
                where dimension.SexKey == id
                select dimension;

            return query.FirstOrDefault();
        }
    }
}
