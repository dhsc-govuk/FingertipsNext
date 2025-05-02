using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class Mapper : IMapper
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
                BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
            "Quintiles" => BenchmarkComparisonMethod.Quintiles,
            _ => BenchmarkComparisonMethod.Unknown,
        };
    }

    public BenchmarkComparison? Map(BenchmarkComparisonModel? source)
    {
        if (source == null)
            return null;

        return new BenchmarkComparison
        {
            // Outcome = new BenchmarkOutcome
            // {
            //  //Outcome = source.Outcome,
            // },
            BenchmarkAreaCode = source.BenchmarkAreaCode,
            BenchmarkAreaName = source.BenchmarkAreaName,
        };
    }

    public Deprivation? Map(DeprivationDimensionModel? source)
    {
        return source == null
            ? null
            : new Deprivation
        {
            Value = source.Name,
            Sequence = source.Sequence,
            Type = source.Type,
            IsAggregate = source.IsAggregate,
        };
    }

    public Age? Map(AgeDimensionModel? source)
    {
        return source == null
            ? null
            : new Age { Value = source.Name, IsAggregate = source.IsAggregate };
    }

    public Sex? Map(SexDimensionModel? source)
    {
        return source == null
            ? null
            : new Sex { Value = source.Name, IsAggregate = source.IsAggregate };
    }

    public HealthDataPoint? Map(HealthMeasureModel? source)
    {
        return source == null
            ? null
            : new HealthDataPoint
            {
                Count = (float?)source.Count,
                Value = (float?)source.Value,
                Year = source.Year,
                BenchmarkComparison = Map(source.BenchmarkComparison),
                IsAggregate = source.IsAggregate,
                LowerConfidenceInterval = (float?)source.LowerCi,
                UpperConfidenceInterval = (float?)source.UpperCi,
                AgeBand = Map(source.AgeDimension),
                Sex = Map(source.SexDimension),
                Trend = source.TrendDimension?.Name,
                Deprivation = Map(source.DeprivationDimension),
            };
    }

    public List<HealthDataPoint> Map(IList<HealthMeasureModel> source)
    {
        return source.Select(Map).ToList();
    }

    public IndicatorQuartileData Map(QuartileDataModel source)
    {
        return new IndicatorQuartileData
        {
            IndicatorId = source.IndicatorId,
            Polarity = MapIndicatorPolarity(source.Polarity),
            Year = source.Year,
            Q0Value = (float?)source.Q0Value,
            Q1Value = (float?)source.Q1Value,
            Q2Value = (float?)source.Q2Value,
            Q3Value = (float?)source.Q3Value,
            Q4Value = (float?)source.Q4Value,
            AreaValue = (float?)source.AreaValue,
            AncestorValue = (float?)source.AncestorValue,
            EnglandValue = (float?)source.EnglandValue,
        };
    }

    public List<IndicatorQuartileData> Map(IList<QuartileDataModel> source)
    {
        return source.Select(Map).ToList();
    }
}
