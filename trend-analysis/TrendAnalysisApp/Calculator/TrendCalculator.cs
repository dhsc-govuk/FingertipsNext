using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;
using static TrendAnalysisApp.Constants;

namespace TrendAnalysisApp.Calculator;

public class TrendCalculator(TrendMarkerCalculator legacyCalculator, LegacyMapper legacyMapper) : ITrendCalculator
{
    private readonly TrendMarkerCalculator legacyCalculator = legacyCalculator;
    private readonly LegacyMapper legacyMapper = legacyMapper;
    public const int RequiredNumberOfDataPoints = 5;

    /// <summary>
    /// Calculates the latest trend for a given indicator and its most recent health measure data points.
    /// </summary>
    public Trend CalculateTrend(IndicatorDimensionModel indicator, IEnumerable<HealthMeasureModel> healthMeasures) {
        if (indicator.ValueType == null || !legacyMapper.ValueTypeMap.TryGetValue(indicator.ValueType, out int mappedValueType)) {
            // For PoC simply return generic CannotBeCalculated flag without reason i.e. invalid value type for trends, in this case
            return Trend.CannotBeCalculated;
        }

        var legacyTrendRequest = legacyMapper.ToLegacy(mappedValueType, healthMeasures);
        var legacyTrend = legacyCalculator.GetResults(legacyTrendRequest);

        return AdjustForPolarity(legacyMapper.TrendMarkerMap[legacyTrend.Marker], indicator.Polarity);
    }

    public static Trend AdjustForPolarity(Trend trend, string polarity) {
        var isIncreasing = trend == Trend.Increasing;
        var isDecreasing = trend == Trend.Decreasing;

        if (
            polarity == null ||
            polarity == Polarity.NoJudgement || 
            (!isIncreasing && !isDecreasing)
        ) {
            return trend;
        }

        if (polarity == Polarity.HighIsGood) {
            return isIncreasing ? Trend.IncreasingAndGettingBetter : Trend.DecreasingAndGettingWorse;
        }

        return isIncreasing ? Trend.IncreasingAndGettingWorse : Trend.DecreasingAndGettingBetter;
    }
}
