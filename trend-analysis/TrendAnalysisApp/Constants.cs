using System.Collections.Concurrent;
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
        public const int CommandTimeout = 90;
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
        // Default to using 1 = All ages
        public const short DefaultAgeDimensionKey = 1;
        // Default to using 0 = All
        public const short DefaultDeprivationDimensionKey = 0;
        // Default to using 2 = Persons
        public const byte DefaultSexDimensionKey = 2;

        // A map containing any PoC indicators that do not use the standard dimensions
        public static readonly Dictionary<short, IndicatorSearchDimensions> NonStandardDimensionMap = new()
        {
            {1, new IndicatorSearchDimensions(29, DefaultSexDimensionKey)},
            {3, new IndicatorSearchDimensions(29, DefaultSexDimensionKey)},
            {4, new IndicatorSearchDimensions(23, DefaultSexDimensionKey)},
            {5, new IndicatorSearchDimensions(33, 1)},
            {6, new IndicatorSearchDimensions(41, DefaultSexDimensionKey)},
            {7, new IndicatorSearchDimensions(35, DefaultSexDimensionKey)},
            {9, new IndicatorSearchDimensions(21, DefaultSexDimensionKey)},
            {10, new IndicatorSearchDimensions(29, DefaultSexDimensionKey)},
            {11, new IndicatorSearchDimensions(39, DefaultSexDimensionKey)},
            {13, new IndicatorSearchDimensions(21, DefaultSexDimensionKey)},
            {14, new IndicatorSearchDimensions(37, DefaultSexDimensionKey)},
            {15, new IndicatorSearchDimensions(34, 1)},
            {17, new IndicatorSearchDimensions(33, DefaultSexDimensionKey)},
            {19, new IndicatorSearchDimensions(DefaultAgeDimensionKey, 1)},
            {24, new IndicatorSearchDimensions(32, DefaultSexDimensionKey)},
            {25, new IndicatorSearchDimensions(38, DefaultSexDimensionKey)},
            {27, new IndicatorSearchDimensions(42, DefaultSexDimensionKey)},
            {28, new IndicatorSearchDimensions(21, DefaultSexDimensionKey)},
            {29, new IndicatorSearchDimensions(40, 1)},
            {30, new IndicatorSearchDimensions(49, 1)}
        };
    }
}
