using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TrendAnalysisApp.Repository.Models;

public class HealthMeasureModel
{
    [Key]
    public int HealthMeasureKey { get; set; }
    public AgeDimensionModel? AgeDimension { get; set; }
    [ForeignKey("AgeDimension")]
    public short AgeKey { get; set; }
    public AreaDimensionModel? AreaDimension { get; set; }
    [ForeignKey("AreaDimension")]
    public int AreaKey { get; set; }
    public DeprivationDimensionModel? DeprivationDimension { get; set; }
    [ForeignKey("DeprivationDimension")]
    public short DeprivationKey { get; set; }
    public IndicatorDimensionModel? IndicatorDimension { get; set; }
    [ForeignKey("IndicatorDimension")]
    public short IndicatorKey { get; set; }
    public SexDimensionModel? SexDimension { get; set; }
    [ForeignKey("SexDimension")]
    public byte SexKey { get; set; }
    public TrendDimensionModel? TrendDimension { get; set; }
    [ForeignKey("TrendDimension")]
    public byte TrendKey { get; set; }
    public double? Count { get; set; }
    public double? Denominator { get; set; }
    public double Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    public required short Year { get; set; }
}
