using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorWithHealthDataForAreas : IndicatorBase
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("benchmarkMethod")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BenchmarkComparisonMethod BenchmarkMethod { get; set; }

    [JsonPropertyName("areaHealthData")]
    public IEnumerable<HealthDataForArea> AreaHealthData { get; init; } = Array.Empty<HealthDataForArea>();
}