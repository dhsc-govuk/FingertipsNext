using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

public class DenormalisedHealthMeasureModel
{
    [Key]
    public required int HealthMeasureKey { get; set; }
    public required string AreaDimensionCode { get; set; }
    public required string AreaDimensionName { get; set; }
    public required string IndicatorDimensionName { get; set; }
    public required string SexDimensionName { get; set; }
    public required bool SexDimensionHasValue { get; set; }
    public required string TrendDimensionName { get; set; }
    public required string AgeDimensionName { get; set; }
    public required bool AgeDimensionHasValue { get; set; }
    public required string DeprivationDimensionName { get; set; }
    public required string DeprivationDimensionType { get; set; }
    public required byte DeprivationDimensionSequence { get; set; }
    public required bool DeprivationDimensionHasValue { get; set; }
    public required double? Count { get; set; }
    public required double? Value { get; set; }
    public required double? LowerCi { get; set; }
    public required double? UpperCi { get; set; }
    public required short Year { get; set; }
    public required string BenchmarkComparisonOutcome { get; set; }
    public required string BenchmarkComparisonMethod { get; set; }
    public required string BenchmarkComparisonIndicatorPolarity { get; set; }
    public required string BenchmarkComparisonAreaCode { get; set; }
    public required string BenchmarkComparisonAreaName { get; set; }

    public HealthMeasureModel Normalise() 
    {
        return new HealthMeasureModel()
        {
            Year = Year,
            Value = Value,
            Count = Count,
            LowerCi = LowerCi,
            UpperCi = UpperCi,
            AgeDimension = new AgeDimensionModel() { 
                Name = AgeDimensionName,
                HasValue = AgeDimensionHasValue,
            },
            SexDimension = new SexDimensionModel() { 
                Name = SexDimensionName,
                HasValue = SexDimensionHasValue
            },
            IndicatorDimension = new IndicatorDimensionModel() { 
                Name = IndicatorDimensionName,
            },
            AreaDimension = new AreaDimensionModel() { 
                Name = AreaDimensionName,
                Code = AreaDimensionCode,
            },
            DeprivationDimension = new DeprivationDimensionModel() {
                Name = DeprivationDimensionName,
                Type = DeprivationDimensionType,
                Sequence = DeprivationDimensionSequence,
                HasValue = DeprivationDimensionHasValue,
            },
            BenchmarkComparison = new BenchmarkComparisonModel()
            {
                Outcome = BenchmarkComparisonOutcome,
                Method = BenchmarkComparisonMethod,
                IndicatorPolarity = BenchmarkComparisonIndicatorPolarity,
                BenchmarkAreaCode = BenchmarkComparisonAreaCode,
                BenchmarkAreaName = BenchmarkComparisonAreaName,    
            },
            IsAggregate = true
        };
    }
}
