using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;

namespace DHSC.FingertipsNext.Modules.Area.Service;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AreaTypeModel, AreaType>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaTypeName))
            .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.AreaTypeKey))
            .ForMember(dest => dest.HierarchyName, opt => opt.MapFrom(src => src.HierarchyType));

        CreateMap<AreaWithRelationsModel, AreaWithRelations>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Area.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Area.AreaName))
            .ForMember(dest => dest.AreaType, opt => opt.MapFrom(src => src.Area.AreaType))
            //TODO: check this was mapped automagicially .ForMember(dest => dest.AreaType, opt => opt.MapFrom(src => src.Area.AreaType.AreaTypeName))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.ParentArea));
        
        CreateMap<AreaModel, Schemas.Area>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaName));
            //TODO: check this is mapped automagicially .ForMember(dest => dest.AreaType, opt => opt.MapFrom(src => src.AreaType.AreaTypeName))

        CreateMap<AreaModel, RootArea>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaName));
    }
}