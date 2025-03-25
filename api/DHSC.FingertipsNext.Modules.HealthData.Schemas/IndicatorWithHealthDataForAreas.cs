using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorWithHealthDataForAreas
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime EndDate { get; set; }
   
    [JsonPropertyName("polarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity Polarity { get; set; }
    
    [JsonPropertyName("benchmarkMethod")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BenchmarkComparisonMethod BenchmarkMethod { get; set; }
    
    [JsonPropertyName("areaHealthData")]
    public IEnumerable<HealthDataForArea> AreaHealthData { get; init; } = Array.Empty<HealthDataForArea>();
}