namespace TrendAnalysisApp;

/// <summary>
/// Constants class for the Trend Analysis App project.
/// </summary>
public static class Constants {
    public static class Database {
        // The name for the Fingertips DB: used in the environment variable for the connection string.
        public const string FingertipsDbName = "FINGERTIPS_DB";
    }

    public static class Polarity {
        public const string LowIsGood = "Low is good";
        public const string HighIsGood = "High is good";
        public const string NoJudgement = "No judgement";
    }

    public static class Trend {
        public const string NotYetCalculatedDbString = "Not yet calculated";
    }
}
