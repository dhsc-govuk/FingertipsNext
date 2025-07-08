using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas
{
    public abstract class IndicatorDataBase
    {
        [JsonPropertyName("indicatorId")]
        public int IndicatorId { get; init; }

        [JsonPropertyName("polarity")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public IndicatorPolarity? Polarity { get; set; }

        [JsonPropertyName("frequency")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public CollectionFrequency CollectionFrequency { get; init; }
    }
}
