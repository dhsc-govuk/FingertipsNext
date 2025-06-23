using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class IndicatorDimensionModel
{
    [Key]
    public short IndicatorKey { get; set; }

    [MaxLength(255)]
    public required string Name { get; set; }

    public int IndicatorId { get; set; }

    public string? BenchmarkComparisonMethod { get; set; }

    public string? Polarity { get; set; }

    [NotMapped]
    public int LatestYear { get; set; }
}
