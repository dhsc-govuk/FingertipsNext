using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;

namespace DHSC.FingertipsNext.Modules.Area.Service;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AreaWithRelationsModel, AreaWithRelations>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.Area.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Area.AreaName))
            .ForMember(dest => dest.HierarchyName, opt => opt.MapFrom(src => src.Area.HierarchyType))
            .ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Area.Level))
            .ForMember(dest => dest.Parent, opt => opt.MapFrom(src => src.ParentArea))
            .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Children))
            .ForMember(dest => dest.Ancestors, opt => opt.MapFrom(src => src.Ancestors));

        CreateMap<AreaModel, Schemas.Area>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaName))
            .ForMember(dest => dest.HierarchyName, opt => opt.MapFrom(src => src.HierarchyType));
        
        CreateMap<AreaModel, RootArea>()
            .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.AreaCode))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AreaName));
    }
}