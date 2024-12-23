using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Core.Schema;

namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public class IndicatorsService : IIndicatorsService
    {
        private readonly IRepository _repository;
        
        public IndicatorsService(HealthMeasureDbContext dbContext)
        {
            _repository = new Repository.Repository(dbContext);
        }

        public IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string[] areaCodes, short[] years)
        {
            var indicatorData = _repository.GetIndicatorData(indicatorId, areaCodes, years);

            return indicatorData.Select(BuildHealthMeasure);
        }

        private static HealthMeasure BuildHealthMeasure(Repository.Models.HealthMeasure healthMeasure)
        {
            return new HealthMeasure
            {
                HealthMeasureKey = healthMeasure.HealthMeasureKey,
                AreaDimension = BuildAreaDimension(healthMeasure.AreaDimension),
                IndicatorDimension = BuildIndicatorDimension(healthMeasure.IndicatorDimension),
                SexDimension = BuildSexDimension(healthMeasure.SexDimension),
                AgeDimension = BuildAgeDimension(healthMeasure.AgeDimension),
                Count = healthMeasure.Count,
                Value = healthMeasure.Value,
                LowerCi = healthMeasure.LowerCI,
                UpperCi = healthMeasure.UpperCI,
                Year = healthMeasure.Year,
            };

        }

        private static AreaDimension BuildAreaDimension(Repository.Models.AreaDimension areaDimension)
        {
            return new AreaDimension
            {
                AreaKey = areaDimension.AreaKey,
                Code = areaDimension.Code,
                Name = areaDimension.Name,
                StartDate = areaDimension.StartDate,
                EndDate = areaDimension.EndDate
            };
        }

        private static IndicatorDimension BuildIndicatorDimension(Repository.Models.IndicatorDimension indicatorDimension)
        {
            return new IndicatorDimension
            {
                IndicatorKey = indicatorDimension.IndicatorKey,
                Name = indicatorDimension.Name,
                IndicatorId = indicatorDimension.IndicatorId,
                StartDate = indicatorDimension.StartDate,
                EndDate = indicatorDimension.EndDate
            };
        }

        private static SexDimension BuildSexDimension(Repository.Models.SexDimension sexDimension)
        {
            return new SexDimension
            {
                SexKey = sexDimension.SexKey,
                Name = sexDimension.Name,
                IsFemale = sexDimension.IsFemale,
                HasValue = sexDimension.HasValue,
                SexId = sexDimension.SexId
            };
        }

        private static AgeDimension BuildAgeDimension(Repository.Models.AgeDimension ageDimension)
        {
            return new AgeDimension
            {
                AgeKey = ageDimension.AgeKey,
                Name = ageDimension.Name,
                AgeId = ageDimension.AgeID
            };
        }
    }
}
