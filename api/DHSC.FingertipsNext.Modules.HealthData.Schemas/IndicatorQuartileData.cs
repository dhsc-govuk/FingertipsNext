using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorQuartileData
{
    [JsonPropertyName("indicatorId")]
    public int IndicatorId { get; init; }

    [JsonPropertyName("polarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity Polarity { get; set; }

    [JsonPropertyName("year")]
    public short Year { get; init; }

    [JsonPropertyName("q0Value")]
    public float? Q0Value { get; init; }

    [JsonPropertyName("q1Value")]
    public float? Q1Value { get; init; }

    [JsonPropertyName("q2Value")]
    public float? Q2Value { get; init; }

    [JsonPropertyName("q3Value")]
    public float? Q3Value { get; init; }

    [JsonPropertyName("q4Value")]
    public float? Q4Value { get; init; }

    [JsonPropertyName("areaValue")]
    public float? AreaValue { get; init; }

    [JsonPropertyName("ancestorValue")]
    public float? AncestorValue { get; init; }

    [JsonPropertyName("englandValue")]
    public float? EnglandValue { get; init; }
}