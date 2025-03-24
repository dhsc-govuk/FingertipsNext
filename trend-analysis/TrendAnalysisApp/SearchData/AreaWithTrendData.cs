namespace TrendAnalysisApp.SearchData;

public class AreaWithTrendData(string areaCode, string descriptiveTrendString)
{
    public readonly string areaCode = areaCode;
    public readonly string trend = descriptiveTrendString;
}
