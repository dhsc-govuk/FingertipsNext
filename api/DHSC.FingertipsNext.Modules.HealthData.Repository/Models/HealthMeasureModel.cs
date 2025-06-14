﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class HealthMeasureModel
{
    [Key]
    public int HealthMeasureKey { get; set; }
    public required AreaDimensionModel AreaDimension { get; set; }

    [ForeignKey("AreaDimension")]
    public int AreaKey { get; set; }
    public required IndicatorDimensionModel IndicatorDimension { get; set; }

    [ForeignKey("IndicatorDimension")]
    public short IndicatorKey { get; set; }

    public required SexDimensionModel SexDimension { get; set; }

    [ForeignKey("SexDimension")]
    public byte SexKey { get; set; }

    public TrendDimensionModel? TrendDimension { get; set; }

    [ForeignKey("TrendDimension")]
    public byte? TrendKey { get; set; }

    public required AgeDimensionModel AgeDimension { get; set; }

    [ForeignKey("AgeDimension")]
    public short AgeKey { get; set; }

    public required DeprivationDimensionModel DeprivationDimension { get; set; }

    [ForeignKey("DeprivationDimension")]
    public short DeprivationKey { get; set; }

    public double? Count { get; set; }

    public double? Value { get; set; }

    public double? LowerCi { get; set; }

    public double? UpperCi { get; set; }

    public short Year { get; set; }

    public bool IsSexAggregatedOrSingle { get; set; } = true;

    public bool IsAgeAggregatedOrSingle { get; set; } = true;

    public bool IsDeprivationAggregatedOrSingle { get; set; } = true;

    public bool IsAggregate { get; set; }

    [NotMapped]
    public BenchmarkComparisonModel? BenchmarkComparison { get; set; }
}
