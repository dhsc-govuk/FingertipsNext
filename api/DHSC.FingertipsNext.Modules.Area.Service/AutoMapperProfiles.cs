using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;

namespace DHSC.FingertipsNext.Modules.Area.Service;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        // CreateMap<AreaDimensionModel, AreaWithRelations>();
        
        CreateMap<AreaModel, RootArea>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaName));
    }
}