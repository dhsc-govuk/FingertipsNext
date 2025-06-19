using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class IndicatorQuartileData
{
    [JsonPropertyName("indicatorId")]
    public int IndicatorId { get; init; }

    [JsonPropertyName("polarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity? Polarity { get; set; }

    [JsonPropertyName("year")]
    public short? Year { get; init; }

    /// <summary>
    ///     The date period that the Quartile data is for
    /// </summary>
    [JsonPropertyName("datePeriod")]
    public required DatePeriod DatePeriod { get; init; }

    [JsonPropertyName("q0Value")]
    public double? Q0Value { get; init; }

    [JsonPropertyName("q1Value")]
    public double? Q1Value { get; init; }

    [JsonPropertyName("q2Value")]
    public double? Q2Value { get; init; }

    [JsonPropertyName("q3Value")]
    public double? Q3Value { get; init; }

    [JsonPropertyName("q4Value")]
    public double? Q4Value { get; init; }

    [JsonPropertyName("areaValue")]
    public double? AreaValue { get; init; }

    [JsonPropertyName("ancestorValue")]
    public double? AncestorValue { get; init; }

    [JsonPropertyName("englandValue")]
    public double? EnglandValue { get; init; }
}