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
    public Task<List<string>> GetHierarchies()
    {
        return _areaRepository.GetHierarchiesAsync();
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public async Task<List<AreaType>> GetAreaTypes(string? hierarchyType = null)
    {
        return _mapper.Map<List<AreaType>>(await _areaRepository.GetAreaTypesAsync(hierarchyType));
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="includeSiblings"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeAncestors,
        bool? includeSiblings,
        string? childAreaType
    )
    {
        var area = await _areaRepository.GetAreaAsync(
            areaCode,
            includeChildren ?? false,
            includeAncestors ?? false,
            includeSiblings ?? false,
            childAreaType
        );

        return area == null ? null : _mapper.Map<AreaWithRelations>(area);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaTypeKey"></param>
    /// <returns></returns>
    public async Task<List<Schemas.Area>> GetAreaDetailsForAreaType(string areaTypeKey)
    {
        var areas = await _areaRepository.GetAreasForAreaTypeAsync(areaTypeKey);
        
        return _mapper.Map<List<Schemas.Area>>(areas);
    }

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    public RootArea? GetRootArea()
    {
        return new RootArea { Name="England", Code= "E92000001" };
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
