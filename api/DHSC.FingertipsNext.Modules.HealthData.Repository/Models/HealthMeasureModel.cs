﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class HealthMeasureModel
{
    [Key]
    public int HealthMeasureKey { get; set; }
    public AreaDimensionModel AreaDimension { get; set; }

    [ForeignKey("AreaDimension")]
    public int AreaKey { get; set; }
    public IndicatorDimensionModel IndicatorDimension { get; set; }

    [ForeignKey("IndicatorDimension")]
    public short IndicatorKey { get; set; }

    public SexDimensionModel SexDimension { get; set; }

    [ForeignKey("SexDimension")]
    public byte SexKey { get; set; }

    public TrendDimensionModel TrendDimension { get; set; }

    [ForeignKey("TrendDimension")]
    public byte TrendKey { get; set; }

    public AgeDimensionModel AgeDimension { get; set; }

    [ForeignKey("AgeDimension")]
    public short AgeKey { get; set; }

    public DeprivationDimensionModel DeprivationDimension { get; set; }

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
    
    [NotMapped]
    public bool IsAggregate => IsAgeAggregatedOrSingle && IsSexAggregatedOrSingle && IsDeprivationAggregatedOrSingle;

    public required DateTime PublishedAt { get; set; }

    public required string BatchId { get; set; }

    [NotMapped]
    public BenchmarkComparisonModel BenchmarkComparison { get; set; }
}
