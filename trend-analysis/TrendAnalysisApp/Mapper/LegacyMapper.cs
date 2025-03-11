using System.Collections.ObjectModel;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Calculator.Legacy.Models;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Mapper;

public class LegacyMapper {
    // All indicators use this default range in the legacy calculator
    private readonly int DefaultYearRange = 1;
    // Maps value type names from model to the value type names in the legacy calculator
    public readonly ReadOnlyDictionary<string, int> ValueTypeMap;
    // Maps legacy TrendMarkers to the Trend enum in the new calculator
    public readonly ReadOnlyDictionary<TrendMarker, Trend> TrendMarkerMap;

    public LegacyMapper() {
        var valueTypeDict = new Dictionary<string, int>
        {
            { "Directly standardised rate", ValueTypeIds.DirectlyStandardisedRate },
            { "Crude rate", ValueTypeIds.CrudeRate },
            { "Proportion", ValueTypeIds.Proportion }
        };
        ValueTypeMap = new ReadOnlyDictionary<string, int>(valueTypeDict);

        var trendMarkerDict = new Dictionary<TrendMarker, Trend>
        {
            { TrendMarker.CannotBeCalculated, Trend.CannotBeCalculated },
            { TrendMarker.Increasing, Trend.Increasing },
            { TrendMarker.Decreasing, Trend.Decreasing },
            { TrendMarker.NoChange, Trend.NoChange }
        };
        TrendMarkerMap = new ReadOnlyDictionary<TrendMarker, Trend>(trendMarkerDict);
    }

    /// <summary>
    /// Maps indicator metadata and a list of health measures to a valid legacy calculation request.
    /// </summary>
    public TrendRequest ToLegacy(int valueTypeId, bool useProportions, IEnumerable<HealthMeasureModel> healthMeasures) {
        var legacyTrendRequest = new TrendRequest
        {
            YearRange = DefaultYearRange,
            ValueTypeId = valueTypeId
        };

        if (useProportions) {
            legacyTrendRequest.ComparatorMethodId = ComparatorMethodIds.SpcForProportions;
        }

        legacyTrendRequest.Data = HealthMeasuresToLegacyDatasetList(healthMeasures);
        return legacyTrendRequest;
    }

    private static List<CoreDataSet> HealthMeasuresToLegacyDatasetList(IEnumerable<HealthMeasureModel> healthMeasures) {
        return [.. healthMeasures.Select(HealthMeasureToLegacyDataset)];
    }

    private static CoreDataSet HealthMeasureToLegacyDataset(HealthMeasureModel healthMeasure) {
        return new CoreDataSet()
        {
            Count = healthMeasure.Count,
            Value = healthMeasure.Value,
            // Legacy Calculator expects this value as a double, so we set this to 0 if null
            Denominator = healthMeasure.Denominator ?? 0,
            Year = healthMeasure.Year,
            LowerCI95 = healthMeasure.LowerCI,
            UpperCI95 = healthMeasure.UpperCI
        };
    }
}
