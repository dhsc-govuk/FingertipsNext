using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorWithHealthDataForAreas
{
    [JsonPropertyName("indicatorId")]
    public int IndicatorId { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("polarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity Polarity { get; set; }

    [JsonPropertyName("frequency")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public CollectionFrequency CollectionFrequency { get; init; }

    [JsonPropertyName("benchmarkMethod")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BenchmarkComparisonMethod BenchmarkMethod { get; set; }

    [JsonPropertyName("areaHealthData")]
    public IEnumerable<HealthDataForArea> AreaHealthData { get; init; } = Array.Empty<HealthDataForArea>();
}