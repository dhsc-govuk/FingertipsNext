using System.ComponentModel.DataAnnotations;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class IndicatorDimensionModel
{
    [Key]
    public short IndicatorKey { get; set; }

    [MaxLength(255)]
    public string Name { get; set; }

    public int IndicatorId { get; set; }
    
    public DateTime StartDate { get; set; }
    
    public DateTime EndDate { get; set; }
    
    public string BenchmarkComparisonMethod { get; set; }
    
    public string Polarity { get; set; }
}
