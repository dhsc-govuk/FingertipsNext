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
    public AreaService(IAreaRepository areaRepository, IMapper mapper)
    {
        _areaRepository = areaRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Get all available hierarchy types
    /// </summary>
    /// <returns></returns>
    public Task<string[]> GetHierarchies()
    {
        // 200 string[]
        // The available hierarchy types, e.g. NHS or Administrative

        return _areaRepository.GetHierarchiesAsync();
    }

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public Task<string[]> GetAreaTypes(string? hierarchyType = null)
    {
        // 200 string[]
        // The available area types e.g. ICB, PCN or GP Surgery

        return _areaRepository.GetAreaTypesAsync(hierarchyType);
    }

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including
    /// its children and ancestors.
    /// </summary>
    /// <param name="areaCode">The area code of the area/geography</param>
    /// <param name="includeChildren">Optionally, include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="includeAncestors">Optionally, include the ancestor areas.</param>
    /// <param name="childAreaType">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns>The requested area node, or null if it cannot be located.</returns>
    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeAncestors,
        string? childAreaType
    )
    {
        var area = await _areaRepository.GetAreaAsync(areaCode, includeChildren ?? false, includeAncestors ?? false, childAreaType);

        if (area == null)
            return null;

        // TODO: mapper
        return null;
        //return _mapper.Map<AreaWithRelations>(first);
    }

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns></returns>
    public async Task<RootArea?> GetRootArea()
    {
        // 200 RootArea
        // The root area node

        var rootArea = await _areaRepository.GetRootAreaAsync();

        if (rootArea == null)
            return null;

        return _mapper.Map<RootArea>(rootArea);
    }

    public static void RegisterMappings(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(AutoMapperProfiles));
    }
}
