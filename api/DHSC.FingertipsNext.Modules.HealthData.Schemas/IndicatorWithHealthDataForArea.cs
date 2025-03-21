using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorWithHealthDataForArea
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;
    
    [JsonPropertyName("areaHealthData")]
    public IEnumerable<HealthDataForArea> AreaHealthData { get; init; } = Array.Empty<HealthDataForArea>();
    
    [JsonPropertyName("polarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity Polarity { get; set; }
    
}