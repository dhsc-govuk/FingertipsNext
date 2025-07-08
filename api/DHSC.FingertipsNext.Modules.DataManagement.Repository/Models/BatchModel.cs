using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

[Table("Batch", Schema = "DataManagement")]
public class BatchModel
{
    [Key] public int BatchKey { get; init; }

    [MaxLength(50)] public required string BatchId { get; init; }

    public required int IndicatorId { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime PublishedAt { get; init; }
    public required Guid UserId { get; init; }
    public required BatchStatus Status { get; init; }
}

public enum BatchStatus
{
    Received,
    Deleted
}