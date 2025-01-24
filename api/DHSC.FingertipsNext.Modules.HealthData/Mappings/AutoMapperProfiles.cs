using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<HealthMeasureModel, HealthMeasure>();
        CreateMap<AgeDimensionModel, AgeDimension>();
        CreateMap<AreaDimensionModel, AreaDimension>();
        CreateMap<IndicatorDimensionModel, IndicatorDimension>();
        CreateMap<SexDimensionModel, SexDimension>();
        CreateMap<HealthMeasureModel, HealthDataPoint>()
            .ForMember(dest => dest.LowerConfidenceInterval, options => options.MapFrom(src => src.LowerCI))
            .ForMember(dest => dest.UpperConfidenceInterval, options => options.MapFrom(src => src.UpperCI))
            .ForMember(dest => dest.AgeBand, options => options.MapFrom(src => src.AgeDimension.Name))
            .ForMember(dest => dest.Sex, options => options.MapFrom(src => src.SexDimension.Name));
    }
}
