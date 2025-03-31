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

    public static class Indicator {
        public const int GpRegisteredPopulationId = 337;
        public const int ResidentPopulationId = 92708;

        // IDs to skip for trend analysis. The following are full population indicators and are not
        // displayed in the Fingertips website.
        public static readonly IList<int> IdsToSkip = new ReadOnlyCollection<int>(
        [
            GpRegisteredPopulationId,
            ResidentPopulationId
        ]);
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
}
