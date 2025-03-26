using System.Collections.ObjectModel;
using TrendAnalysisApp.SearchData;

namespace TrendAnalysisApp;

/// <summary>
/// Constants class for the Trend Analysis App project.
/// </summary>
public static class Constants {
    public static class Database {
        // The name for the Fingertips DB: used in the environment variable for the connection string.
        public const string FingertipsDbName = "FINGERTIPS_DB";
        // With the current DB settings, when running load-heavy processes we may need longer than the default 30s.
        public const int CommandTimeout = 120;
    }

    public static class Polarity {
        public const string LowIsGood = "Low is good";
        public const string HighIsGood = "High is good";
        public const string NoJudgement = "No judgement";
    }

    public static class Trend {
        public const string NotYetCalculated = "Not yet calculated";
        public const string CannotBeCalculated = "Cannot be calculated";
        public const string Increasing = "Increasing";
        public const string Decreasing = "Decreasing";
        public const string NoSignificantChange = "No significant change";
        public const string IncreasingAndGettingBetter = "Increasing and getting better";
        public const string IncreasingAndGettingWorse = "Increasing and getting worse";
        public const string DecreasingAndGettingBetter = "Decreasing and getting better";
        public const string DecreasingAndGettingWorse = "Decreasing and getting worse";
    }

    public static class Indicator {
        // Default to using 2 = All ages
        public const short DefaultAgeDimensionKey = 2;
        // Default to using 1 = All
        public const short DefaultDeprivationDimensionKey = 1;
        // Default to using 3 = Persons
        public const byte DefaultSexDimensionKey = 3;

        // A map containing any PoC indicators that do not use the standard dimensions
        public static readonly ReadOnlyDictionary<short, IndicatorSearchDimensions> NonStandardDimensionMap = new(
            new Dictionary<short, IndicatorSearchDimensions> {
                {2, new IndicatorSearchDimensions(30, DefaultSexDimensionKey)},
                {4, new IndicatorSearchDimensions(30, DefaultSexDimensionKey)},
                {5, new IndicatorSearchDimensions(24, DefaultSexDimensionKey)},
                {6, new IndicatorSearchDimensions(34, 2)},
                {7, new IndicatorSearchDimensions(42, DefaultSexDimensionKey)},
                {8, new IndicatorSearchDimensions(36, DefaultSexDimensionKey)},
                {10, new IndicatorSearchDimensions(22, DefaultSexDimensionKey)},
                {11, new IndicatorSearchDimensions(30, DefaultSexDimensionKey)},
                {12, new IndicatorSearchDimensions(40, DefaultSexDimensionKey)},
                {14, new IndicatorSearchDimensions(22, DefaultSexDimensionKey)},
                {15, new IndicatorSearchDimensions(38, DefaultSexDimensionKey)},
                {16, new IndicatorSearchDimensions(35, 2)},
                {18, new IndicatorSearchDimensions(34, DefaultSexDimensionKey)},
                {19, new IndicatorSearchDimensions(49, DefaultSexDimensionKey)},
                {20, new IndicatorSearchDimensions(DefaultAgeDimensionKey, 2)},
                {21, new IndicatorSearchDimensions(32, DefaultSexDimensionKey)},
                {25, new IndicatorSearchDimensions(33, DefaultSexDimensionKey)},
                {26, new IndicatorSearchDimensions(39, DefaultSexDimensionKey)},
                {28, new IndicatorSearchDimensions(43, DefaultSexDimensionKey)},
                {29, new IndicatorSearchDimensions(21, DefaultSexDimensionKey)},
                {30, new IndicatorSearchDimensions(41, 2)},
                {31, new IndicatorSearchDimensions(50, 2)}
            }
        );
    }
}
