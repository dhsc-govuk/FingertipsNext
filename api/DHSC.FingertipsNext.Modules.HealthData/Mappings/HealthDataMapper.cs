using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class HealthDataMapper : IHealthDataMapper
{
    public IndicatorPolarity MapIndicatorPolarity(string? source)
    {
        return source switch
        {
            "High is good" => IndicatorPolarity.HighIsGood,
            "Low is good" => IndicatorPolarity.LowIsGood,
            "No judgement" => IndicatorPolarity.NoJudgement,
            _ => IndicatorPolarity.Unknown,
        };
    }

    public BenchmarkComparisonMethod MapBenchmarkComparisonMethod(string? source)
    {
        return source switch
        {
            "Confidence intervals overlapping reference value (95.0)" =>
                BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
            "Confidence intervals overlapping reference value (99.8)" =>
                BenchmarkComparisonMethod.CIOverlappingReferenceValue998,
            "Quintiles" => BenchmarkComparisonMethod.Quintiles,
            _ => BenchmarkComparisonMethod.Unknown,
        };
    }

    public static DatePeriodType MapDatePeriodType(string periodType)
    {
        return periodType switch
        {
            "Calendar" => DatePeriodType.Calendar,
            "Financial" => DatePeriodType.Financial,
            "November-November" => DatePeriodType.NovemberNovember,
            _ => DatePeriodType.Unknown,
        };
    }

    public HealthDataPoint Map(HealthMeasureModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new HealthDataPoint
        {
            Count = source.Count,
            Value = source.Value,
            Year = source.Year,
            DatePeriod = Map(source.FromDateDimension.Date, source.ToDateDimension.Date, source.PeriodDimension.Period),
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

    public IList<HealthDataPoint> Map(IList<HealthMeasureModel> source)
    {
        return source.Select(Map).ToList();
    }

    public IList<IndicatorQuartileData> Map(IList<QuartileDataModel> source)
    {
        return source.Select(Map).ToList();
    }

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

    private static DatePeriod Map(DateTime fromDate, DateTime toDate, string periodStr)
    {
        return new DatePeriod
        {
            PeriodType = MapDatePeriodType(periodStr),
            From = DateOnly.FromDateTime(fromDate),
            To = DateOnly.FromDateTime(toDate),
        };
    }

    private static Deprivation Map(DeprivationDimensionModel source)
    {
        return new Deprivation
        {
            Value = source.Name,
            Sequence = source.Sequence,
            Type = source.Type,
            IsAggregate = source.IsAggregate,
        };
    }

    private static Age Map(AgeDimensionModel source)
    {
        return new Age { Value = source.Name, IsAggregate = source.IsAggregate };
    }

    private static Sex Map(SexDimensionModel source)
    {
        return new Sex { Value = source.Name, IsAggregate = source.IsAggregate };
    }

    private IndicatorQuartileData Map(QuartileDataModel source)
    {
        return new IndicatorQuartileData
        {
            IndicatorId = source.IndicatorId,
            Polarity = source.Polarity == null ? null : MapIndicatorPolarity(source.Polarity),
            Year = source.Year,
            DatePeriod = source.FromDate == null || source.ToDate == null || source.Period == null ? null : Map((DateTime)source.FromDate, (DateTime)source.ToDate, (string)source.Period),
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
}
