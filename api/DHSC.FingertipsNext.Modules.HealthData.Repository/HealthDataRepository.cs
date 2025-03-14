using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;
using BenchmarkComparison = DHSC.FingertipsNext.Modules.HealthData.Repository.Models.BenchmarkComparisonModel;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => inequalities.Contains("sex") ? true : hm.SexDimension.HasValue == false)
            .Where(hm => inequalities.Contains("age") ? true : hm.AgeDimension.HasValue == false)
            // TODO: Will be expanded to allow the deprivation dimension to be retrieved based on a query param in DHSCFT-396
            .Where(hm => hm.DeprivationDimension.HasValue == false)
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.AgeDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Include(hm => hm.DeprivationDimension)
            .Select(x => new HealthMeasureModel()
            {
                Year = x.Year,
                Value = x.Value,
                Count = x.Count,
                LowerCi = x.LowerCi,
                UpperCi = x.UpperCi,
                AgeDimension = new AgeDimensionModel()
                {
                    Name = x.AgeDimension.Name,
                    HasValue = x.AgeDimension.HasValue,
                },
                SexDimension = new SexDimensionModel()
                {
                    Name = x.SexDimension.Name,
                    HasValue = x.SexDimension.HasValue
                },
                IndicatorDimension = new IndicatorDimensionModel()
                {
                    Name = x.IndicatorDimension.Name,
                },
                AreaDimension = new AreaDimensionModel()
                {
                    Code = x.AreaDimension.Code,
                    Name = x.AreaDimension.Name,
                },
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                },
                DeprivationDimension = new DeprivationDimensionModel()
                {
                    Name = x.DeprivationDimension.Name,
                    Type = x.DeprivationDimension.Type,
                    Sequence = x.DeprivationDimension.Sequence,
                    HasValue = x.DeprivationDimension.HasValue
                }
            })
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintilesAsync(int indicatorId, string[] areaCodes, int[] years)
    {
        var healthData = await _dbContext.DenormalisedHealthMeasure.FromSql(
                $"""
                SELECT 
                  hm.HealthMeasureKey,
                  'A1234' as AreaDimensionCode,
                  'SomeArea' as AreaDimensionName,
                  ind.Name as IndicatorDimensionName,
                  'Male' as SexDimensionName,
                  'true' as SexDimensionHasValue,
                  'trendName' as TrendDimensionName,
                  'over 18' as AgeDimensionName,
                  'true' as AgeDimensionHasValue,
                  'most deprived' as DeprivationDimensionName,
                  'IMD 2019' as DeprivationDimensionType,
                  '9' as DeprivationDimensionSequence,
                  'true' as DeprivationDimentionHasValue,
                  Count,
                  Value,
                  LowerCi,
                  UpperCi,
                  Year,
                  'similar' as BenchmarkComparisonOutcome,
                  'CI with reference 95' as BenchmarkComparisonMethod,
                  'High is better' as BenchmarkComparisonIndicatorPolarity,
                  'E92000001' as BenchmarkComparisonAreaCode,
                  'England' as BenchmarkComparisonAreaName
                FROM
                  dbo.HealthMeasure hm
                JOIN
                  dbo.IndicatorDimension ind
                ON
                  hm.IndicatorKey = ind.IndicatorKey
                JOIN
                  dbo.AreaDimension ad
                ON
                  hm.AreaKey = ad.AreaKey
                JOIN
                  dbo.SexDimension as sex
                ON
                  hm.SexKey = sex.SexKey
                JOIN
                  dbo.AgeDimension as age
                ON
                  hm.AgeKey = age.AgeKey
                JOIN
                  dbo.DeprivationDimension as imd
                ON
                  hm.DeprivationKey = imd.DeprivationKey
                WHERE
                  ind.IndicatorId = {indicatorId}
                AND
                  ad.Code in {areaCodes}
                AND
                  hm.Year in {years}
                AND
                  age.hasValue = false
                AND
                  sex.hasValue = false
                AND
                  imd.hasValue = false
                ORDER BY
                  hm.Year;
                """
            )
            .ToListAsync();

            
        foreach (var item in healthData)
        {
            item.BenchmarkComparison = new BenchmarkComparison()
            {
                Outcome = "Best",
                Method = "Quintile",
                IndicatorPolarity = "HighIsGood",
                BenchmarkAreaName = "England",
                BenchmarkAreaCode = "E92000001"
            };
        }

        return healthData;
    }


}
