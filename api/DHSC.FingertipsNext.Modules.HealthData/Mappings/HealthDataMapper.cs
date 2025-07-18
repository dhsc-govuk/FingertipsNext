using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using System.Drawing;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class HealthDataMapper : IHealthDataMapper
{
    public IndicatorPolarity MapIndicatorPolarity(string? source) => source switch
    {
        "High is good" => IndicatorPolarity.HighIsGood,
        "Low is good" => IndicatorPolarity.LowIsGood,
        "No judgement" => IndicatorPolarity.NoJudgement,
        _ => IndicatorPolarity.Unknown
    };

    public CollectionFrequency MapCollectionFrequency(string? source)
    {
        if (source == null)
            return CollectionFrequency.Annually;
        source = source.Trim().ToUpperInvariant();
        return source switch
        {
            "ANNUALLY" => CollectionFrequency.Annually,
            "MONTHLY" => CollectionFrequency.Monthly,
            "QUARTERLY" => CollectionFrequency.Quarterly,
            _ => CollectionFrequency.Annually
        };
    }

    public BenchmarkComparisonMethod MapBenchmarkComparisonMethod(string? source) => source switch
    {
        "Confidence intervals overlapping reference value (95.0)" =>
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
        "Confidence intervals overlapping reference value (99.8)" =>
            BenchmarkComparisonMethod.CIOverlappingReferenceValue998,
        "Quintiles" => BenchmarkComparisonMethod.Quintiles,
        _ => BenchmarkComparisonMethod.Unknown,
    };

    private static DatePeriodType MapDatePeriodType(string? periodType) => periodType switch
    {
        "Academic" => DatePeriodType.Academic,
        "Calendar" => DatePeriodType.Calendar,
        "Financial" => DatePeriodType.Financial,
        "Financial multi-year" => DatePeriodType.FinancialMultiYear,
        "Financial year end point" => DatePeriodType.FinancialYearEndPoint,
        "Yearly" => DatePeriodType.Yearly,
        _ => DatePeriodType.Unknown,
    };

    public HealthDataPoint Map(HealthMeasureModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new HealthDataPoint
        {
            Count = source.Count,
            Value = source.Value,
            Year = source.Year,
            DatePeriod = Map(source.FromDate, source.ToDate, source.IndicatorDimension.PeriodType),
            BenchmarkComparison = Map(source.BenchmarkComparison),
            IsAggregate = source.IsAggregate,
            LowerConfidenceInterval = source.LowerCi,
            UpperConfidenceInterval = source.UpperCi,
            AgeBand = Map(source.AgeDimension),
            Sex = Map(source.SexDimension),
            Trend = source.TrendDimension?.Name ?? string.Empty,
            Deprivation = Map(source.DeprivationDimension),
        };
    }

    public static HealthDataPoint Map(DenormalisedHealthMeasureModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new HealthDataPoint
        {
            Count = source.Count,
            Value = source.Value,
            Year = source.Year,
            DatePeriod = Map(source.FromDate, source.ToDate, source.PeriodType),
            BenchmarkComparison = Map(source.BenchmarkComparisonOutcome == null
            ? null
            : new BenchmarkComparisonModel
            {
                Outcome = source.BenchmarkComparisonOutcome,
                BenchmarkAreaCode = source.BenchmarkComparisonAreaCode!,
                BenchmarkAreaName = source.BenchmarkComparisonAreaName!
            }),
            IsAggregate = source.AgeDimensionIsAggregate && source.SexDimensionIsAggregate && source.DeprivationDimensionIsAggregate,
            LowerConfidenceInterval = source.LowerCi,
            UpperConfidenceInterval = source.UpperCi,
            AgeBand = Map(new AgeDimensionModel()
            {
                Name = source.AgeDimensionName,
                HasValue = source.AgeDimensionHasValue,
                IsAggregate = source.AgeDimensionIsAggregate,
            }),
            Sex = new Sex { Value = source.SexDimensionName, IsAggregate = source.SexDimensionIsAggregate },
            Trend = source.TrendDimensionName ?? string.Empty,
            Deprivation = Map(new DeprivationDimensionModel()
            {
                Name = source.DeprivationDimensionName,
                Type = source.DeprivationDimensionType,
                Sequence = source.DeprivationDimensionSequence,
                HasValue = source.DeprivationDimensionHasValue,
                IsAggregate = source.DeprivationDimensionIsAggregate,
            })
        };
    }

    public Sex Map(SexDimensionModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new Sex { Value = source.Name, IsAggregate = source.IsAggregate };
    }

    public IList<HealthDataPoint> Map(IList<HealthMeasureModel> source) => source.Select(Map).ToList();

    public IList<HealthDataPoint> Map(IList<DenormalisedHealthMeasureModel> source) => source.Select(Map).ToList();

    public IList<IndicatorQuartileData> Map(IList<QuartileDataModel> source) => source.Select(Map).ToList();

    private static BenchmarkComparison? Map(BenchmarkComparisonModel? source)
    {
        // HealthMeasureModel allows nullable
        if (source == null)
            return null;

        return new BenchmarkComparison
        {
            Outcome = source.Outcome switch
            {
                "NOT COMPARED" => BenchmarkOutcome.NotCompared,
                "LOWEST" => BenchmarkOutcome.Lowest,
                "LOWER" => BenchmarkOutcome.Lower,
                "LOW" => BenchmarkOutcome.Low,
                "MIDDLE" => BenchmarkOutcome.Middle,
                "HIGH" => BenchmarkOutcome.High,
                "HIGHER" => BenchmarkOutcome.Higher,
                "HIGHEST" => BenchmarkOutcome.Highest,
                "BETTER" => BenchmarkOutcome.Better,
                "BEST" => BenchmarkOutcome.Best,
                "WORSE" => BenchmarkOutcome.Worse,
                "WORST" => BenchmarkOutcome.Worst,
                "SIMILAR" => BenchmarkOutcome.Similar,
                _ => BenchmarkOutcome.NotCompared,

            },
            BenchmarkAreaCode = source.BenchmarkAreaCode,
            BenchmarkAreaName = source.BenchmarkAreaName,
        };
    }

    private static DatePeriod Map(DateTime fromDate, DateTime toDate, string? periodStr) => new DatePeriod
    {
        PeriodType = MapDatePeriodType(periodStr),
        From = DateOnly.FromDateTime(fromDate),
        To = DateOnly.FromDateTime(toDate),
    };

    private static Deprivation Map(DeprivationDimensionModel source) => new Deprivation
    {
        Value = source.Name,
        Sequence = source.Sequence,
        Type = source.Type,
        IsAggregate = source.IsAggregate,
    };

    private static Age Map(AgeDimensionModel source) => new Age { Value = source.Name, IsAggregate = source.IsAggregate };

    private IndicatorQuartileData Map(QuartileDataModel source) => new IndicatorQuartileData
    {
        IndicatorId = source.IndicatorId,
        Polarity = source.Polarity == null ? null : MapIndicatorPolarity(source.Polarity),
        Sex = (source.SexName != null && source.IsSexAggregatedOrSingle != null) ? new Sex { Value = source.SexName, IsAggregate = (bool)source.IsSexAggregatedOrSingle } : null,
        Age = (source.AgeName != null && source.IsAgeAggregatedOrSingle != null) ? new Age { Value = source.AgeName, IsAggregate = (bool)source.IsAgeAggregatedOrSingle } : null,
        IsAggregate = source.IsAgeAggregatedOrSingle.HasValue && source.IsSexAggregatedOrSingle.HasValue ? source.IsAgeAggregatedOrSingle.Value && source.IsSexAggregatedOrSingle.Value : null,
        Year = source.Year,
        DatePeriod = (source.FromDate.HasValue && source.ToDate.HasValue && source.PeriodType != null)
                ? Map(source.FromDate.Value, source.ToDate.Value, source.PeriodType)
                : null!,
        CollectionFrequency = MapCollectionFrequency(source.CollectionFrequency),
        Q0Value = source.Q0Value,
        Q1Value = source.Q1Value,
        Q2Value = source.Q2Value,
        Q3Value = source.Q3Value,
        Q4Value = source.Q4Value,
        AreaValue = source.AreaValue,
        AncestorValue = source.AncestorValue,
        EnglandValue = source.EnglandValue,
    };
}
