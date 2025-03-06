using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<HealthMeasureModel, HealthDataPoint>()
            .ForMember(dest => dest.LowerConfidenceInterval, options => options.MapFrom(src => src.LowerCi))
            .ForMember(dest => dest.UpperConfidenceInterval, options => options.MapFrom(src => src.UpperCi))
            .ForMember(dest => dest.AgeBand, options => options.MapFrom(src => src.AgeDimension.Name))
            .ForMember(dest => dest.Sex, options => options.MapFrom(src => src.SexDimension.Name))
            .ForMember(dest => dest.Trend, options => options.MapFrom(src => src.TrendDimension.Name));
    }
}
