﻿using System.ComponentModel.DataAnnotations;

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
    public required bool SexDimensionIsAggregate { get; set; }
    public required string TrendDimensionName { get; set; }
    public required string AgeDimensionName { get; set; }
    public required bool AgeDimensionHasValue { get; set; }
    public required bool AgeDimensionIsAggregate { get; set; }
    public required string DeprivationDimensionName { get; set; }
    public required string DeprivationDimensionType { get; set; }
    public required byte DeprivationDimensionSequence { get; set; }
    public required bool DeprivationDimensionHasValue { get; set; }
    public required bool DeprivationDimensionIsAggregate { get; set; }
    public required double? Count { get; set; }
    public required double? Value { get; set; }
    public required double? LowerCi { get; set; }
    public required double? UpperCi { get; set; }
    public required short Year { get; set; }
    public string? BenchmarkComparisonOutcome { get; set; }
    public required string BenchmarkComparisonIndicatorPolarity { get; set; }
    public string? BenchmarkComparisonAreaCode { get; set; }
    public string? BenchmarkComparisonAreaName { get; set; }

    private BenchmarkComparisonModel? NormalisedBenchmark =>
        BenchmarkComparisonOutcome == null
            ? null
            : new BenchmarkComparisonModel
            {
                Outcome = BenchmarkComparisonOutcome,
                BenchmarkAreaCode = BenchmarkComparisonAreaCode!,
                BenchmarkAreaName = BenchmarkComparisonAreaName!
            };

    public HealthMeasureModel Normalise()
    {
        return new HealthMeasureModel()
        {
            Year = Year,
            Value = Value,
            Count = Count,
            LowerCi = LowerCi,
            UpperCi = UpperCi,
            AgeDimension = new AgeDimensionModel()
            {
                Name = AgeDimensionName,
                HasValue = AgeDimensionHasValue,
                IsAggregate = AgeDimensionIsAggregate,
            },
            SexDimension = new SexDimensionModel()
            {
                Name = SexDimensionName,
                HasValue = SexDimensionHasValue,
                IsAggregate = SexDimensionIsAggregate
            },
            IndicatorDimension = new IndicatorDimensionModel()
            {
                Name = IndicatorDimensionName,
            },
            AreaDimension = new AreaDimensionModel()
            {
                Name = AreaDimensionName,
                Code = AreaDimensionCode,
            },
            DeprivationDimension = new DeprivationDimensionModel()
            {
                Name = DeprivationDimensionName,
                Type = DeprivationDimensionType,
                Sequence = DeprivationDimensionSequence,
                HasValue = DeprivationDimensionHasValue,
                IsAggregate = DeprivationDimensionIsAggregate,
            },
            TrendDimension = new TrendDimensionModel()
            {
                Name = TrendDimensionName,
            },
            BenchmarkComparison = NormalisedBenchmark,
            IsAggregate = true
        };
    }
}
