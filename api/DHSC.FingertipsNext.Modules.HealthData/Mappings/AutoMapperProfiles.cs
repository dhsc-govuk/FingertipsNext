using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class AutoMapperProfiles : Profile
{
    private static IndicatorPolarity MapIndicatorPolarity(string DbIndicatorPolarity)
    {
        return DbIndicatorPolarity switch
        {
            "High is good" => IndicatorPolarity.HighIsGood,
            "Low is good" => IndicatorPolarity.LowIsGood,
            "No judgement" => IndicatorPolarity.NoJudgement,
            _ => throw new ArgumentException(message: $"invalid IndicatorPolarity value {DbIndicatorPolarity}")
        };
    }
    private static BenchmarkComparisonMethod MapBenchmarkMethod(string DbBenchmarkComparisonMethod)
    {
        return DbBenchmarkComparisonMethod switch
        {
            "Confidence intervals overlapping reference value (95.0)" => BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
            "Confidence intervals overlapping reference value (99.8)" => BenchmarkComparisonMethod.CIOverlappingReferenceValue99,
            "Quintiles" => BenchmarkComparisonMethod.Quintiles,
            "No comparison" => BenchmarkComparisonMethod.None,
            _ => throw new ArgumentException(message: $"invalid BenchmarkComparisonMethod value {DbBenchmarkComparisonMethod}")
        };
    }
    public AutoMapperProfiles()
    {
        CreateMap<string, IndicatorPolarity>().ConstructUsing((strValue) => AutoMapperProfiles.MapIndicatorPolarity(strValue));

        CreateMap<string, BenchmarkComparisonMethod>().ConstructUsing((strValue) => AutoMapperProfiles.MapBenchmarkMethod(strValue));

        CreateMap<BenchmarkComparisonModel, BenchmarkComparison>()
            .ForMember(dest => dest.Outcome, options => options.MapFrom(src => src.Outcome))
            .ForMember(dest => dest.Method, options => options.MapFrom(src => src.Method))
            .ForMember(dest => dest.IndicatorPolarity, options => options.MapFrom(src => src.IndicatorPolarity))
            .ForMember(dest => dest.BenchmarkAreaCode, options => options.MapFrom(src => src.BenchmarkAreaCode))
            .ForMember(dest => dest.BenchmarkAreaName, options => options.MapFrom(src => src.BenchmarkAreaName));

        CreateMap<HealthMeasureModel, HealthDataPoint>()
            .ForMember(dest => dest.LowerConfidenceInterval, options => options.MapFrom(src => src.LowerCi))
            .ForMember(dest => dest.UpperConfidenceInterval, options => options.MapFrom(src => src.UpperCi))
            .ForMember(dest => dest.AgeBand, options => options.MapFrom(src => src.AgeDimension.Name))
            .ForMember(dest => dest.Sex, options => options.MapFrom(src => src.SexDimension.Name))
            .ForMember(dest => dest.Trend, options => options.MapFrom(src => src.TrendDimension.Name))
            .ForMember(dest => dest.BenchmarkComparison, options => options.MapFrom(src => src.BenchmarkComparison))
            .ForMember(dest => dest.Deprivation, options => options.MapFrom(src => src.DeprivationDimension.Name));
    }
}
