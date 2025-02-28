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
    public TrendDimensionModel? TrendDimension { get; set; }
    [ForeignKey("TrendDimension")]
    public byte TrendKey { get; set; }
    public required AgeDimensionModel AgeDimension { get; set; }
    [ForeignKey("AgeDimension")]
    public required short AgeKey { get; set; }
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    
    public required short Year { get; set; }
}
