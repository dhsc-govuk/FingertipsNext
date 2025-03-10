using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Calculator;

public class TrendCalculator(TrendMarkerCalculator legacyCalculator, LegacyMapper legacyMapper) : ITrendCalculator
{
    private readonly TrendMarkerCalculator legacyCalculator = legacyCalculator;
    private readonly LegacyMapper legacyMapper = legacyMapper;

    /// <summary>
    /// Calculates the latest trend for a given indicator and its most recent health measure data points.
    /// </summary>
    public Trend CalculateTrend(IndicatorDimensionModel indicator, IEnumerable<HealthMeasureModel> healthMeasures) {
        if (indicator.ValueType == null || !legacyMapper.ValueTypeMap.TryGetValue(indicator.ValueType, out int mappedValueType)) {
            // For PoC simply return generic CannotBeCalculated flag without reason i.e. invalid value type for trends, in this case
            return Trend.CannotBeCalculated;
        }

        var legacyTrendRequest = legacyMapper.ToLegacy(mappedValueType, indicator.UseProportionsForTrend, healthMeasures);
        var legacyTrend = legacyCalculator.GetResults(legacyTrendRequest);

        return legacyMapper.TrendMarkerMap[legacyTrend.Marker];
    }
}
