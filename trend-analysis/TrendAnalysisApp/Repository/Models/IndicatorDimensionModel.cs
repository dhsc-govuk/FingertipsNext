using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

/// TODO - DHSCFT-374 Trend Analysis - in next JIRA need to also retrieve
/// useProportionsForTrend and value type (needs to be in DB first)
public class IndicatorDimensionModel
{
    [Key]
    public short IndicatorKey { get; set; }
    [MaxLength(255)]
    public string? Name { get; set; }
    public int IndicatorId { get; set; }
}
