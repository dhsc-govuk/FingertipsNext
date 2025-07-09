using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Common.Schemas;

public class SimpleError
{
    [JsonPropertyName("message")]
    public required string Message { get; init; }
    

}

public class ErrorWithDetail : SimpleError
{
    [JsonPropertyName("errors")] 
    public ICollection<string>? Errors { get; init; }
}