using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

public class TrendDimensionModel
{
    [Key]
    public byte TrendKey { get; set; }
    [MaxLength(20)]
    public string? Name { get; set; }
    public bool HasValue { get; set; }
}
