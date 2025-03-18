using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private const string Sex = "sex";
    private const string Age = "age";
    private const string Deprivation = "deprivation";

    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    private struct InequalitiesCount
    {
        public int? SexCount { get; init; }
        public int? AgeCount { get; init; }
        public int? DeprivationCount { get; init; }
    }

    private static bool ShouldIncludeSexDimension(string[] inequalitiesParams, List<InequalitiesCount> inequalityDimensionKeysCount)
    {
        return inequalitiesParams.Contains(Sex) || inequalityDimensionKeysCount[0].SexCount == 1;
    }

    private static bool ShouldIncludeAgeDimension(string[] inequalitiesParams, List<InequalitiesCount> inequalityDimensionKeysCount)
    {
        return inequalitiesParams.Contains(Age) || inequalityDimensionKeysCount[0].AgeCount == 1;
    }

    private static bool ShouldIncludeDeprivationDimension(List<InequalitiesCount> inequalityDimensionKeysCount)
    {
        // TODO: Will be expanded to check the inequalities params contain "deprivation" in DHSCFT-396.
        return inequalityDimensionKeysCount[0].DeprivationCount == 1;
    }

    private async Task<List<InequalitiesCount>> CountDistinctInequalityDimensionKeys(int indicatorId, string[] inequalities)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Include(hm => hm.IndicatorDimension)
            .GroupBy(x => x.IndicatorKey)
            .Select(x => new InequalitiesCount()
            {
                // When new inequality dimensions are added, we will need to add a count for them here.
                SexCount = inequalities.Contains(Sex) ? null : x.Select(hm => hm.SexKey).Distinct().Count(),
                AgeCount = inequalities.Contains(Age) ? null : x.Select(hm => hm.AgeKey).Distinct().Count(),
                DeprivationCount = inequalities.Contains(Deprivation) ? null : x.Select(hm => hm.DeprivationKey).Distinct().Count()
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        var inequalityDimensionKeysCount = await CountDistinctInequalityDimensionKeys(indicatorId, inequalities);
        if (inequalityDimensionKeysCount.Count == 0)
        {
            return Array.Empty<HealthMeasureModel>();
        }

        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => ShouldIncludeSexDimension(inequalities, inequalityDimensionKeysCount)
                ? true
                : hm.SexDimension.HasValue == false)
            .Where(hm => ShouldIncludeAgeDimension(inequalities, inequalityDimensionKeysCount)
                ? true
                : hm.AgeDimension.HasValue == false)
            .Where(hm => ShouldIncludeDeprivationDimension(inequalityDimensionKeysCount) ? true : hm.DeprivationDimension.HasValue == false)
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
}
