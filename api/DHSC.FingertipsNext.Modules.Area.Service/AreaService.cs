using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Area.Service;

/// <summary>
///
/// </summary>
public class AreaService : IAreaService
{
    private readonly IAreaRepository _areaRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaRepository"></param>
    /// <param name="mapper"></param>
    public AreaService(IAreaRepository areaRepository, IMapper mapper)
    {
        _areaRepository = areaRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public Task<string[]> GetHierarchies()
    {
        return _areaRepository.GetHierarchiesAsync();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public Task<string[]> GetAreaTypes(string? hierarchyType = null)
    {
        return _areaRepository.GetAreaTypesAsync(hierarchyType);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeAncestors,
        string? childAreaType
    )
    {
        var area = await _areaRepository.GetAreaAsync(areaCode, includeChildren ?? false, includeAncestors ?? false, childAreaType);

        return area == null ? null : _mapper.Map<AreaWithRelations>(area);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public async Task<RootArea?> GetRootArea()
    {
        var rootArea = await _areaRepository.GetRootAreaAsync();

        return rootArea == null ? null : _mapper.Map<RootArea>(rootArea);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="services"></param>
    public static void RegisterMappings(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(AutoMapperProfiles));
    }
}
