using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class HealthMeasureModel
{
    [Key]
    public int HealthMeasureKey { get; set; }
    public AreaDimensionModel? AreaDimension { get; set; }

    [ForeignKey("AreaDimension")]
    public int AreaKey { get; set; }
    public IndicatorDimensionModel? IndicatorDimension { get; set; }

    [ForeignKey("IndicatorDimension")]
    public short IndicatorKey { get; set; }
    public SexDimensionModel? SexDimension { get; set; }

    [ForeignKey("SexDimension")]
    public byte SexKey { get; set; }
    public TrendDimensionModel? TrendDimension { get; set; }
    [ForeignKey("TrendDimension")]
    public byte TrendKey { get; set; }
    public AgeDimensionModel? AgeDimension { get; set; }
    [ForeignKey("AgeDimension")]
    public short AgeKey { get; set; }
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    public  short Year { get; set; }
}
