using System.Globalization;
using System.Text.RegularExpressions;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public enum BenchmarkComparisonMethod
{
    Unknown,
    Rag,
    Quintiles
}

public static partial class BenchmarkComparisonMethodConvertor
{
    [GeneratedRegex(@"\d+(\.\d+)?")]
    private static partial Regex NumberRegex();
    
    public static BenchmarkComparisonMethod Convert(string method)
    {
        if (method.Contains("Confidence intervals", StringComparison.OrdinalIgnoreCase))
            return BenchmarkComparisonMethod.Rag;
        if (method.Contains("Quintiles", StringComparison.OrdinalIgnoreCase))
            return BenchmarkComparisonMethod.Quintiles;
        
        return BenchmarkComparisonMethod.Unknown;
    }

    public static float GetConfidenceLevel(string method)
    {
        
        var match = NumberRegex().Match(method);
        if (match.Success)
            return float.Parse(match.Value, CultureInfo.InvariantCulture);

        return 0;
    }
}
