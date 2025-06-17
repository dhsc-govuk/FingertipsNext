using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

public class BatchModel
{
    [Key]
    public int BatchKey { get; set; }
    [MaxLength(50)]
    public required string BatchId { get; set; }
    [ForeignKey("IndicatorDimension")]
    public short IndicatorKey { get; set; }
    [ForeignKey("CreatedDate")]
    public int ToDateKey { get; set; }
}