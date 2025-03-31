using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository;
using TrendAnalysisApp.Repository.Models;
using TrendAnalysisApp.SearchData;

namespace TrendAnalysisApp;

/// <summary>
/// The Trend Data Processor Class.
/// </summary>
/// <param name="indicatorRepo"></param>
/// <param name="fileHelper"></param>
public class TrendDataProcessor(
    IIndicatorRepository indicatorRepo,
    IIndicatorJsonFileHelper fileHelper
)
{
    private readonly IIndicatorRepository _indicatorRepo = indicatorRepo;
    private readonly IIndicatorJsonFileHelper _fileHelper = fileHelper;
    private const string _jsonIndicatorFilePath = "SearchData/assets/indicators.json";

    /// <summary>
    /// Static helper method which can be used in a parallel context.
    /// It will calculate and save all trends relating to a given indicator
    /// across multiple dimensions e.g. age, deprivation, sex, area and
    /// and return the per area trends, which can be used in the indicator search.
    /// </summary>
    /// <param name="indicator"></param>
    /// <param name="healthMeasureRepository"></param>
    /// <param name="trendCalculator"></param>
    private static async Task<IndicatorTrendDataForSearch> ProcessOne(
        IndicatorDimensionModel indicator,
        HealthMeasureRepository healthMeasureRepository,
        TrendCalculator trendCalculator
    )
    {
        var healthMeasures = await healthMeasureRepository.GetByIndicator(indicator.IndicatorKey);
        var groupedHealthMeasures = healthMeasures
            .GroupBy(hm => new {
                hm.AgeKey,
                hm.AreaKey,
                hm.DeprivationKey,
                hm.SexKey
            });
        var trendDataForSearch = new IndicatorTrendDataForSearch
        {
            IndicatorId = indicator.IndicatorId
        };

        foreach (var hmGroup in groupedHealthMeasures) {
            var mostRecentDataPoints = hmGroup
                .OrderByDescending(hm => hm.Year)
                .Take(TrendCalculator.RequiredNumberOfDataPoints);

            if (!mostRecentDataPoints.Any()) { continue; }

            var trend = trendCalculator.CalculateTrend(indicator, mostRecentDataPoints);
            healthMeasureRepository.UpdateTrendKey(mostRecentDataPoints.First(), (byte) trend);

            var latestDataPoint = mostRecentDataPoints.First();
            if (
                latestDataPoint.IsAgeAggregatedOrSingle &&
                latestDataPoint.IsDeprivationAggregatedOrSingle &&
                latestDataPoint.IsSexAggregatedOrSingle
            ) {
                trendDataForSearch.AreaToTrendList.Add(
                    new AreaWithTrendData(
                        latestDataPoint.AreaDimension.Code,
                        IndicatorTrendDataForSearch.MapTrendEnumToDescriptiveString(trend)
                    )
                );
            }
        }

        await healthMeasureRepository.SaveChanges();
        Console.WriteLine($"Processed indicator: ({indicator.IndicatorKey}) {indicator.Name}");

        return trendDataForSearch;
    }

    /// <summary>
    /// Entrypoint for processing the trend data.
    /// </summary>
    public async Task Process(ServiceProvider serviceProvider)
    {
        var indicators = await _indicatorRepo.GetAll();
        var tasks = indicators
        .Where(indicator => !Constants.Indicator.IdsToSkip.Contains(indicator.IndicatorId))
        .Select(indicator => 
        {
            return Task.Run(async () =>
            {
                using var scope = serviceProvider.CreateScope();
                var dbContext = scope.ServiceProvider.GetRequiredService<HealthMeasureDbContext>();
                var healthMeasureRepository = new HealthMeasureRepository(dbContext);

                var legacyMapper = serviceProvider.GetRequiredService<LegacyMapper>();
                var scopedLegacyCalculator = scope.ServiceProvider.GetRequiredService<TrendMarkerCalculator>();
                var trendCalculator = new TrendCalculator(scopedLegacyCalculator, legacyMapper);

                return await ProcessOne(indicator, healthMeasureRepository, trendCalculator);
            });
        });

        var indicatorTrendDataForSearch = await Task.WhenAll(tasks);
        UpdateIndicatorSearchData(indicatorTrendDataForSearch);
    }

    public void UpdateIndicatorSearchData(IEnumerable<IndicatorTrendDataForSearch> perIndicatorTrendData) {
        JArray jsonIndicatorList = _fileHelper.Read(_jsonIndicatorFilePath);

        foreach (var trendData in perIndicatorTrendData) {
            foreach (var jsonIndicator in jsonIndicatorList) {
                var jsonIndicatorKey = jsonIndicator.Value<int>("indicatorID");
 
                if (jsonIndicatorKey == trendData.IndicatorId) {
                    jsonIndicator["trendsByArea"] = JArray.FromObject(trendData.AreaToTrendList);
                    break;
                }
            }
        }

        _fileHelper.Write(_jsonIndicatorFilePath, jsonIndicatorList);
        Console.WriteLine($"Updated trend data in indicators.json for {perIndicatorTrendData.Count()} indicators");
    }
}
