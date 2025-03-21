using System.Collections.ObjectModel;
using TrendAnalysisApp.Calculator;

namespace TrendAnalysisApp.SearchData;

/// <summary>
/// Represents the indicator trend data that is used for AI search.
/// It links an indicator ID with the trends for each area in which the indicator is available
/// </summary>
public class IndicatorTrendDataForSearch
{
    public int IndicatorId { get; set; }
    public List<AreaWithTrendData> AreaToTrendList = [];

    public static readonly ReadOnlyDictionary<Trend, string> TrendToFullTrendStringMap= new(
        new Dictionary<Trend, string>
        {
            {Trend.NotYetCalculated, Constants.Trend.NotYetCalculated},
            {Trend.CannotBeCalculated, Constants.Trend.CannotBeCalculated},
            {Trend.Increasing, Constants.Trend.Increasing},
            {Trend.Decreasing, Constants.Trend.Decreasing},
            {Trend.NoChange, Constants.Trend.NoSignificantChange},
            {Trend.IncreasingAndGettingBetter, Constants.Trend.IncreasingAndGettingBetter},
            {Trend.IncreasingAndGettingWorse, Constants.Trend.IncreasingAndGettingWorse},
            {Trend.DecreasingAndGettingBetter, Constants.Trend.DecreasingAndGettingBetter},
            {Trend.DecreasingAndGettingWorse, Constants.Trend.DecreasingAndGettingWorse},
        }
    );

    public static string MapTrendEnumToDescriptiveString(Trend trend) {
        if (!TrendToFullTrendStringMap.TryGetValue(trend, out string? descriptiveTrendString)) {
            return Constants.Trend.CannotBeCalculated;
        }

        return descriptiveTrendString ?? Constants.Trend.CannotBeCalculated;
    }
}
