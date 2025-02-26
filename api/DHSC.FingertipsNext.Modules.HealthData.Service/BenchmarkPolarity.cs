namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class BenchmarkPolarity
{
    public const string LowIsGood = "Low Is Good";
    public const string HighIsGood = "High Is Good";
    public const string RagLower = "LOWER";
    public const string RagHigher = "HIGHER";
    public const string RagBetter = "BETTER";
    public const string RagWorse = "WORSE";
    public const string RagSimilar = "SIMILAR";
    
    public static string GetRagString(int ragValue, string polarity)
    {
        if (polarity == LowIsGood) return GetLowerIsGood(ragValue);
        if (polarity == HighIsGood) return GetHigherIsGood(ragValue);
        return GetNoJudgement(ragValue);
    }

    public static string GetNoJudgement(int ragValue)
    {
        if (ragValue < 0) return RagLower;
        if (ragValue > 0) return RagHigher;
        return RagSimilar;
    }

    public static string GetLowerIsGood(int ragValue)
    {
        if (ragValue < 0) return RagBetter;
        if (ragValue > 0) return RagWorse;
        return RagSimilar;
    }

    public static string GetHigherIsGood(int ragValue)
    {
        if (ragValue < 0) return RagWorse;
        if (ragValue > 0) return RagBetter;
        return RagSimilar;
    }
}