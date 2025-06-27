using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.UserAuth.Schemas;

/// <summary>
///     User info object containing properties for the logged-in user.
/// </summary>
public class UserInfo
{
    /// <summary>
    /// Externally provided user id.
    /// </summary>
    [JsonPropertyName("externalId")]
    public required string ExternalId { get; init; }
}