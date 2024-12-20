using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Core.Schema;
using Microsoft.Extensions.Logging;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    
    // TODO JH - maybe the linq over the dbsets should live in the Repository module so we can test the logic here (e.g. missing dimensions)
    // or elsewhere without needing to worry about structuring our data properly.
    
    public class HealthMeasureService : IHealthMeasureService
    {
        private readonly ILogger _logger;
        private readonly RepositoryDbContext _dbContext;
        
        public HealthMeasureService(ILogger<HealthMeasureService> logger, RepositoryDbContext repositoryDbContext)
        {
            _logger = logger;
            _dbContext = repositoryDbContext ?? throw new ArgumentNullException(nameof(repositoryDbContext));
        }

        public  HealthMeasure? GetFirstHealthMeasure()
        {
            var query = (from healthMeasure in _dbContext.HealthMeasure
                orderby healthMeasure.HealthMeasureKey
                select healthMeasure).FirstOrDefault();

            if (query == null)
            {
                return null;
            }

            var areaDimension = _GetAreaDimension(query.AreaKey);
            if (areaDimension == null)
            {
                _logger.LogUnexpectedEmptyField("areaDimension", query.AreaKey.ToString());
                return null;
            } 
            
            var indicatorDimension = _GetIndicatorDimension(query.IndicatorKey);
            if (indicatorDimension == null)
            {
                _logger.LogUnexpectedEmptyField("indicatorDimension", query.IndicatorKey.ToString());
                return null;
            } 
            
            var sexDimension = _GetSexDimension(query.SexKey);
            if (sexDimension == null)
            {
                _logger.LogUnexpectedEmptyField("sexDimension", query.SexKey.ToString());
                return null;
            } 
            
            var ageDimension = _GetAgeDimension(query.AgeKey);
            if (ageDimension == null)
            {
                _logger.LogUnexpectedEmptyField("ageDimension", query.AgeKey.ToString());
                return null;
            }

            return new HealthMeasure
                {
                    HealthMeasureKey = query.HealthMeasureKey,
                    AreaDimension = areaDimension,
                    IndicatorDimension = indicatorDimension,
                    SexDimension = sexDimension,
                    AgeDimension = ageDimension,
                    Count = query.Count,
                    Value = query.Value,
                    LowerCi = query.LowerCI,
                    UpperCi = query.UpperCI,
                    Year = query.Year,
                };
        }

        private AgeDimension? _GetAgeDimension(short id)
        {
            var query = (from dimension in _dbContext.AgeDimension
                where dimension.AgeKey == id
                select dimension).FirstOrDefault();

            return query == null
                ? null
                : new AgeDimension
                {
                    AgeKey = query.AgeKey,
                    Name = query.Name,
                    AgeId = query.AgeID
                };
        }

        private AreaDimension? _GetAreaDimension(int id)
        {
            var query = (from dimension in _dbContext.AreaDimension
                where dimension.AreaKey == id
                select dimension).FirstOrDefault();

            return query == null
                ? null
                : new AreaDimension
                {
                    AreaKey = query.AreaKey,
                    Code = query.Code,
                    Name = query.Name,
                    StartDate = query.StartDate,
                    EndDate = query.EndDate
                };
        }

        private IndicatorDimension? _GetIndicatorDimension(int id)
        {
            var query = (from dimension in _dbContext.IndicatorDimension
                where dimension.IndicatorKey == id
                select dimension).FirstOrDefault();

            return query == null
                ? null
                : new IndicatorDimension
                {
                    IndicatorKey = query.IndicatorKey,
                    Name = query.Name,
                    IndicatorId = query.IndicatorId,
                    StartDate = query.StartDate,
                    EndDate = query.EndDate
                };
        }

        private SexDimension? _GetSexDimension(byte id)
        {
            var query = (from dimension in _dbContext.SexDimension
                where dimension.SexKey == id
                select dimension).FirstOrDefault();

            return query == null
                ? null
                : new SexDimension
                {
                    SexKey = query.SexKey,
                    Name = query.Name,
                    IsFemale = query.IsFemale,
                    HasValue = query.HasValue,
                    SexId = query.SexId
                };
        }
    }
}
