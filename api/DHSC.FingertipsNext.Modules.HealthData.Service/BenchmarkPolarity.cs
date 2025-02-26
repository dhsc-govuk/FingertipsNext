using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class BenchmarkPolarity
{
    protected BenchmarkPolarity()
    {
    }

    public static BenchmarkOutcome GetOutcome(int comparison, IndicatorPolarity polarity)
    {
        if (polarity == IndicatorPolarity.LowIsGood) return GetLowerIsGood(comparison);
        if (polarity == IndicatorPolarity.HighIsGood) return GetHigherIsGood(comparison);
        return GetNoJudgement(comparison);
    }

    public static BenchmarkOutcome GetNoJudgement(int comparison)
    {
        if (comparison < 0) return BenchmarkOutcome.Lower;
        if (comparison > 0) return BenchmarkOutcome.Higher;
        return BenchmarkOutcome.Similar;
    }

    public static BenchmarkOutcome GetLowerIsGood(int comparison)
    {
        if (comparison < 0) return BenchmarkOutcome.Better;
        if (comparison > 0) return BenchmarkOutcome.Worse;
        return BenchmarkOutcome.Similar;
    }

    public static BenchmarkOutcome GetHigherIsGood(int comparison)
    {
        if (comparison < 0) return BenchmarkOutcome.Worse;
        if (comparison > 0) return BenchmarkOutcome.Better;
        return BenchmarkOutcome.Similar;
    }
}