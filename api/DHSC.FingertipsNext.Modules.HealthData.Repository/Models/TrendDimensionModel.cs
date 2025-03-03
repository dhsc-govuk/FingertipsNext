using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

/// <summary>
/// The Trend Dimension Model.
/// Represents the database object for different types of statistical trends.
/// </summary>
[Serializable]
public class TrendDimensionModel
{
    [Key]
    public byte TrendKey { get; set; }
    [MaxLength(20)]
    public string? Name { get; set; }
    public bool HasValue { get; set; }
}
