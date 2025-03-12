using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public class SimpleError
{
    [JsonPropertyName("message")]
    public required string Message { get; init; }
}