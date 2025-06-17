using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

public class BatchModel
{
    [Key]
    public int BatchKey { get; init; }
    [MaxLength(50)]
    public required string BatchId { get; init; }
    public required int IndicatorId { get; init; }
    public required DateOnly CreatedDate { get; init; }
    // TODO: DHSCFT-961 add status (possibly as an enum or a FK to a status table)
}