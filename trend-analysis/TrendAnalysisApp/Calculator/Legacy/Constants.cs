namespace TrendAnalysisApp.Calculator.Legacy;

public class ValueTypeId
{
    public const int Undefined = -1;
    public const int DirectlyStandardisedRate = 1;
    public const int IndirectlyStandardisedRatio = 2;
    public const int CrudeRate = 3;
    public const int IndirectlyStandardisedRate = 4;
    public const int Proportion = 5;
    public const int Ratio = 6;
    public const int Count = 7;
    public const int Score = 8;
    public const int SlopeIndexOfInequality = 12;
}

public class ValueTypeIds
{
    public const int DirectlyStandardisedRate = 1;
    public const int CrudeRate = 3;
    public const int Proportion = 5;
    public const int Count = 7;
}

public class ComparatorMethodIds
{
    public const int NoComparison = -1;
    public const int SingleOverlappingCIsForOneCiLevel = 1;
    public const int SingleOverlappingCIsForSecondCiLevel = 18;
    public const int SpcForProportions = 5;
    public const int SpcForDsr = 6;
    public const int DoubleOverlappingCIs = 12;
    public const int SuicidePreventionPlan = 14;
    public const int Quintiles = 15;
    public const int Quartiles = 16;
    public const int SingleOverlappingCIsForTwoCiLevels = 17;
}
public enum TrendMarker
{
    CannotBeCalculated = 0, // i.e. not enough data points
    Increasing = 1,
    Decreasing = 2,
    NoChange = 3
}
