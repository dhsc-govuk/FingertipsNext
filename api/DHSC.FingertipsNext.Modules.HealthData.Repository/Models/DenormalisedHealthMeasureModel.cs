using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

public class DenormalisedHealthMeasureModel
{
    [Key]
    public int HealthMeasureKey { get; set; }
    public string AreaDimensionCode { get; set; }
    public string AreaDimensionName { get; set; }
    public string IndicatorDimensionName { get; set; }
    public string SexDimensionName { get; set; }
    public bool SexDimensionHasValue { get; set; }
    public string TrendDimensionName { get; set; }
    public string AgeDimensionName { get; set; }
    public bool AgeDimensionHasValue { get; set; }
    public string DeprivationDimensionName { get; set; }
    public string DeprivationDimensionType { get; set; }
    public byte DeprivationDimensionSequence { get; set; }
    public bool DeprivationDimensionHasValue { get; set; }
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCi { get; set; }
    public double? UpperCi { get; set; }
    public short Year { get; set; }
    public string BenchmarkComparisonOutcome { get; set; }
    public string BenchmarkComparisonMethod { get; set; }
    public string BenchmarkComparisonIndicatorPolarity { get; set; }
    public string BenchmarkComparisonAreaCode { get; set; }
    public string BenchmarkComparisonAreaName { get; set; }
}
