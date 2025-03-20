using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp;

/// <summary>
/// The Trend Data Processor Class.
/// </summary>
/// <param name="indicatorRepo"></param
public class TrendDataProcessor(
    IndicatorRepository indicatorRepo
)
{
    private readonly IndicatorRepository _indicatorRepo = indicatorRepo;

    /// <summary>
    /// Static helper method which can be used in a parallel context.
    /// It will calculate and save all trends relating to a given indicator
    /// across multiple dimensions e.g. age, deprivation, sex, area.
    /// </summary>
    /// <param name="indicator"></param>
    /// <param name="healthMeasureRepository"></param>
    /// <param name="trendCalculator"></param>
    private static async Task ProcessOne(
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

        foreach (var hmGroup in groupedHealthMeasures) {
            var mostRecentDataPoints = hmGroup
                .OrderByDescending(hm => hm.Year)
                .Take(TrendCalculator.RequiredNumberOfDataPoints);
            
            if (
                !mostRecentDataPoints.Any() ||
                mostRecentDataPoints.First().TrendDimension.Name != Constants.Trend.NotYetCalculatedDbString
            ) { continue; }

            var trend = trendCalculator.CalculateTrend(indicator, mostRecentDataPoints);
            healthMeasureRepository.UpdateTrendKey(mostRecentDataPoints.First(), (byte) trend);
        }

        await healthMeasureRepository.SaveChanges();
        Console.WriteLine($"Processed indicator: ({indicator.IndicatorKey}) {indicator.Name}");
    }

    /// <summary>
    /// Entrypoint for processing the trend data.
    /// </summary>
    public async Task Process(ServiceProvider serviceProvider)
    {
        var indicators = await _indicatorRepo.GetAll();

        Parallel.ForEach(indicators, indicator =>
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<HealthMeasureDbContext>();
            var healthMeasureRepository = new HealthMeasureRepository(dbContext);

            var legacyMapper = serviceProvider.GetRequiredService<LegacyMapper>();
            var scopedLegacyCalculator = scope.ServiceProvider.GetRequiredService<TrendMarkerCalculator>();
            var trendCalculator = new TrendCalculator(scopedLegacyCalculator, legacyMapper);

            ProcessOne(indicator, healthMeasureRepository, trendCalculator).Wait();
        });
    }
}
