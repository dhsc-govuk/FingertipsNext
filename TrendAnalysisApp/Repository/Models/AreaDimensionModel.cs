using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

public class AreaDimensionModel
{
    [Key]
    public int AreaKey { get; set; }
    [MaxLength(20)]
    public string? Code { get; set; }
}