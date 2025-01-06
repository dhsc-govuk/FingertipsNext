using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<HealthMeasure, HealthMeasureDto>();
        CreateMap<AgeDimension, AgeDimensionDto>();
        CreateMap<AreaDimension, AreaDimensionDto>();
        CreateMap<IndicatorDimension, IndicatorDimensionDto>();
        CreateMap<SexDimension, SexDimensionDto>();
    }
}
