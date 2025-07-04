using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

public class BatchModel
{
    [Key]
    public int BatchKey { get; init; }
    [MaxLength(50)]
    public required string BatchId { get; init; }
    public required int IndicatorId { get; init; }
    public DateTime Created { get; init; }
    public required DateTime PublishedAt { get; init; }
    public required Guid UserId { get; init; }
    public required BatchStatus Status { get; init; }
}

public enum BatchStatus
{
    Received,
    Deleted
}