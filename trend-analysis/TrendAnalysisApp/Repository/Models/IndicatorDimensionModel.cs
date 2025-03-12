using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

public class IndicatorDimensionModel
{
    [Key]
    public short IndicatorKey { get; set; }
    [MaxLength(255)]
    public string? Name { get; set; }
    public int IndicatorId { get; set; }
    public string? Polarity { get; set; }
    public string? ValueType { get; set; }
}
