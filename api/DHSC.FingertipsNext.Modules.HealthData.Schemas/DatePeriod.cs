using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Date period and type
/// </summary>
public class DatePeriod
{
    [JsonPropertyName("type")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public DatePeriodType PeriodType { get; init; }

    [JsonPropertyName("from")]
    public DateOnly From { get; init; }

    [JsonPropertyName("to")]
    public DateOnly To { get; init; }
}