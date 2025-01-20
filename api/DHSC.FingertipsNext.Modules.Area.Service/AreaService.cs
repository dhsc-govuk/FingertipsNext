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
    public Task<IEnumerable<string>> GetHierarchies()
    {
        // 200 string[]
        // The available hierarchy types, e.g. NHS or Administrative

        throw new NotImplementedException();
    }

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public Task<IEnumerable<string>> GetAreaTypes(string? hierarchyType = null)
    {
        // 200 string[]
        // The available area types e.g. ICB, PCN or GP Surgery

        throw new NotImplementedException();
    }

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including its
    /// children and ancestors.
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// /// <param name="childAreaType"></param>
    /// <returns>The requested area node, or null if it cannot be located.</returns>
    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeAncestors,
        string? childAreaType
    )
    {
        var areaDetails = await _areaRepository.GetAreaData(areaCode);

        if (areaDetails.Count == 0)
            return null;

        var first = areaDetails.First();
        
        return _mapper.Map<AreaWithRelations>(first);
    }

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns></returns>
    public Task<RootArea> GetRootArea()
    {
        // 200 RootArea
        // The root area node

        throw new NotImplementedException();
    }

    public static void RegisterMappings(IServiceCollection services)
    {
        services.AddAutoMapper(typeof(AutoMapperProfiles));
    }
}
