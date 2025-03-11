using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
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
            .ForMember(dest => dest.BenchmarkComparison, options => options.MapFrom(src => src.BenchmarkComparison));
    }
}
