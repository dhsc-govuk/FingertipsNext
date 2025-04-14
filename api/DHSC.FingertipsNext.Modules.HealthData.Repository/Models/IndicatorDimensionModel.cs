using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class IndicatorDimensionModel
{
    [Key]
    public short IndicatorKey { get; set; }

    [MaxLength(255)]
    public string Name { get; set; }

    public int IndicatorId { get; set; }

    public string BenchmarkComparisonMethod { get; set; }
    
    public string Polarity { get; set; }

    public int LatestYear { get; set; }
}
