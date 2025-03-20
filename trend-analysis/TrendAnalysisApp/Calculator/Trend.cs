namespace TrendAnalysisApp.Calculator;

public enum Trend {
    NotYetCalculated = 1,
    CannotBeCalculated = 2,
    Increasing = 3,
    Decreasing = 4,
    NoChange = 5,
    IncreasingAndGettingBetter = 6,
    IncreasingAndGettingWorse = 7,
    DecreasingAndGettingBetter = 8,
    DecreasingAndGettingWorse = 9
}
