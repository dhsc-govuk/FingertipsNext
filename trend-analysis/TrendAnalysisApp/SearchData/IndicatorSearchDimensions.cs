namespace TrendAnalysisApp.SearchData;

/// <summary>
/// Simple readonly class to represent the default dimensions for a given indicator
/// when presenting the trend in the search data.
/// For example, an indicator such as "Perinatal mental health conditions prevalence"
/// will have a specific age and sex dimension rather than the default "All".
/// </summary>
public class IndicatorSearchDimensions(short ageDimensionKey, byte sexDimensionKey)
{
    public readonly short AgeDimensionKey = ageDimensionKey;
    public readonly byte SexDimensionKey = sexDimensionKey;
}
