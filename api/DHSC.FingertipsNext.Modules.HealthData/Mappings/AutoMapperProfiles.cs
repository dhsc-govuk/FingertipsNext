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
    }
}
