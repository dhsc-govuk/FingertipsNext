namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public enum IndicatorPolarity
{
    Unknown,
    NoJudgement,
    LowIsGood,
    HighIsGood
}

public static class IndicatorPolarityConvertor
{
    public static IndicatorPolarity Convert(string polarityFromDb)
    {
        return polarityFromDb switch
        {
            "High is good" => IndicatorPolarity.HighIsGood,
            "Low is good" => IndicatorPolarity.LowIsGood,
            "No judgement" => IndicatorPolarity.NoJudgement,
            _ => IndicatorPolarity.Unknown
        };
    }
}