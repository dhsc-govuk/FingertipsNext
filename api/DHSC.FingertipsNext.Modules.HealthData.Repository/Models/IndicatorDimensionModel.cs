using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
[Table("IndicatorDimension", Schema = "dbo")]
public class IndicatorDimensionModel
{
    private string? collectionFrequency;

    [Key]
    public short IndicatorKey { get; set; }

    [MaxLength(255)]
    public required string Name { get; set; }

    public int IndicatorId { get; set; }

    public string? BenchmarkComparisonMethod { get; set; }

    public string? Polarity { get; set; }

    [NotMapped]
    public DateOnly? LatestToDate { get; set; }
    [NotMapped]
    public DateOnly? LatestFromDate { get; set; }

    public string? PeriodType { get; set; }

    public string? CollectionFrequency
    {
        get
        {
            return collectionFrequency != null ? collectionFrequency.Trim() : null;
        }
        set => collectionFrequency = value;
    }
}


