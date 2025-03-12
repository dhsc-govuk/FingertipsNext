using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Repository;

namespace TrendAnalysisApp;

/// <summary>
/// The Trend Data Processor Class.
/// </summary>
/// <param name="healthMeasureRepo">Repository for health measure data</param>
/// <param name="trendCalculator"></param
public class TrendDataProcessor(
    HealthMeasureRepository healthMeasureRepo,
    IndicatorRepository indicatorRepo,
    TrendCalculator trendCalculator
)
{
    private readonly HealthMeasureRepository _healthMeasureRepo = healthMeasureRepo;
    private readonly IndicatorRepository _indicatorRepo = indicatorRepo;
    private readonly TrendCalculator _trendCalculator = trendCalculator;


    /// <summary>
    /// Entrypoint for processing the trend data.
    /// </summary>
    public async Task Process()
    {
        var indicators = await _indicatorRepo.GetAll();

        foreach (var indicator in indicators) {
            var healthMeasures = await _healthMeasureRepo.GetByIndicator(indicator.IndicatorKey);
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

                var trend = _trendCalculator.CalculateTrend(indicator, mostRecentDataPoints);
                _healthMeasureRepo.UpdateTrendKey(mostRecentDataPoints.First(), (byte) trend);
            }

            await _healthMeasureRepo.SaveChanges();
            Console.WriteLine($"Processed indicator: ({indicator.IndicatorKey}) {indicator.Name}");
        }
    }
}
