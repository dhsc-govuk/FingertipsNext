﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Keyless]
public class QuartileDataModel
{
    public required int IndicatorId { get; set; }
    public required string? Polarity { get; set; }
    public required short? Year { get; set; }
    public required string? AgeName { get; set; }
    public required bool? IsAgeAggregatedOrSingle { get; set; }
    public required string? SexName { get; set; }
    public required bool? IsSexAggregatedOrSingle { get; set; }
    public required DateTime? FromDate { get; set; }
    public required DateTime? ToDate { get; set; }
    public required string? PeriodType { get; set; }
    public required string? ReportingPeriod { get; set; }
    public required string? CollectionFrequency { get; set; }
    public required double? Q0Value { get; set; }
    public required double? Q1Value { get; set; }
    public required double? Q2Value { get; set; }
    public required double? Q3Value { get; set; }
    public required double? Q4Value { get; set; }
    public required double? AreaValue { get; set; }
    public required double? AncestorValue { get; set; }
    public required double? EnglandValue { get; set; }
}
