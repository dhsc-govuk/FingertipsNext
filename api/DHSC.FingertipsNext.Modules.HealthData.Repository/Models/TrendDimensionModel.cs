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
    public required byte TrendKey { get; set; }
    [MaxLength(20)]
    public required string Name { get; set; }
    public required bool HasValue { get; set; }
}
