using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class HealthMeasureModel
{
    [Key]
    public required int HealthMeasureKey { get; set; }
    public required AreaDimensionModel AreaDimension { get; set; }
    [ForeignKey("AreaDimension")]
    public required int AreaKey { get; set; }
    public required IndicatorDimensionModel IndicatorDimension { get; set; }
    [ForeignKey("IndicatorDimension")]
    public required short IndicatorKey { get; set; }
    public required SexDimensionModel SexDimension { get; set; }
    [ForeignKey("SexDimension")]
    public required byte SexKey { get; set; }
    public required AgeDimensionModel AgeDimension { get; set; }
    [ForeignKey("AgeDimension")]
    public required short AgeKey { get; set; }
    public required double Count { get; set; }
    public required double Value { get; set; }
    public required double LowerCI { get; set; }
    public required double UpperCI { get; set; }
    public required short Year { get; set; }
}
