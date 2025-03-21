namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public enum IndicatorPolarity
{
    Unknown,
    NoJudgement,
    LowIsGood,
    HighIsGood
}

public class IndicatorPolarityConvertor
{
    public static IndicatorPolarity Convert(string polarityFromDb)
    {
        if(polarityFromDb.Contains("High", StringComparison.OrdinalIgnoreCase)) return IndicatorPolarity.HighIsGood;
        if(polarityFromDb.Contains("Low", StringComparison.OrdinalIgnoreCase)) return IndicatorPolarity.LowIsGood;
        if(polarityFromDb.Contains("Judgement", StringComparison.OrdinalIgnoreCase)) return IndicatorPolarity.NoJudgement;
        return IndicatorPolarity.Unknown;
    }
}