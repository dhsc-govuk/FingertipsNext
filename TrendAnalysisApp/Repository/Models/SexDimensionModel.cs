using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

public class SexDimensionModel
{
    [Key]
    public byte SexKey { get; set; }
    public byte SexId { get; set; }
}
