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
    private readonly IAreaMapper _areaMapper;

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaRepository"></param>
    /// <param name="areaMapper"></param>
    public AreaService(IAreaRepository areaRepository, IAreaMapper areaMapper)
    {
        _areaRepository = areaRepository;
        _areaMapper = areaMapper;
    }

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    public Task<List<string>> GetHierarchies() =>
        _areaRepository.GetHierarchiesAsync();

    /// <summary>
    /// Gets a list of areas for the list of requested area codes.
    /// </summary>
    /// <param name="areaCodes"></param>
    /// <returns>List of areas requested</returns>
    public async Task<List<Schemas.Area>> GetMultipleAreaDetails(string[] areaCodes)
    {
        return _areaMapper.Map(await _areaRepository.GetMultipleAreaDetailsAsync(areaCodes));
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public async Task<List<AreaType>> GetAreaTypes(string? hierarchyType = null) =>
        _areaMapper.Map(await _areaRepository.GetAreaTypesAsync(hierarchyType));

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeSiblings"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeSiblings,
        string? childAreaType
    )
    {
        var area = await _areaRepository.GetAreaAsync(
            areaCode,
            includeChildren ?? false,
            includeSiblings ?? false,
            childAreaType
        );

        return area == null ? null : _areaMapper.Map(area);
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaTypeKey"></param>
    /// <returns></returns>
    public async Task<List<Schemas.Area>> GetAreaDetailsForAreaType(string areaTypeKey)
    {
        var areas = await _areaRepository.GetAreasForAreaTypeAsync(areaTypeKey);

        return _areaMapper.Map(areas);
    }

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    public RootArea? GetRootArea() =>
        new() { Name = "England", Code = "E92000001" };

    /// <summary>
    ///
    /// </summary>
    /// <param name="services"></param>
    public static void RegisterMappings(IServiceCollection services) => 
        services.AddSingleton<IAreaMapper, AreaMapper>();
}
