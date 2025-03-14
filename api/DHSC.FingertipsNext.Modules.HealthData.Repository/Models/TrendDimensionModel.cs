using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class TrendDimensionModel
{
    [Key]
    public byte TrendKey { get; set; }
    [MaxLength(20)]
    public string Name { get; set; }
    public bool HasValue { get; set; }
}
