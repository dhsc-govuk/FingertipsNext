using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Area.Service;

public class AreaService : IAreaService
{
    private readonly IAreaRepository _areaRepository;
    private readonly IAreaMapper _areaMapper;

    public AreaService(IAreaRepository areaRepository, IAreaMapper areaMapper)
    {
        _areaRepository = areaRepository;
        _areaMapper = areaMapper;
    }

    public Task<IList<string>> GetHierarchies() =>
        _areaRepository.GetHierarchiesAsync();

    public async Task<IList<AreaData>> GetMultipleAreaDetails(string[] areaCodes)
    {
        return _areaMapper.Map(await _areaRepository.GetMultipleAreaDetailsAsync(areaCodes));
    }

    public async Task<IList<AreaType>> GetAreaTypes(string hierarchyType)
    {
        return _areaMapper.Map(await _areaRepository.GetAreaTypesAsync(hierarchyType));
    }

    public async Task<IList<AreaType>> GetAllAreaTypes()
    {
        return _areaMapper.Map(await _areaRepository.GetAllAreaTypesAsync());
    }

    public async Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool includeChildren,
        bool includeSiblings,
        string? childAreaType
    )
    {
        var area = await _areaRepository.GetAreaAsync(
            areaCode,
            includeChildren,
            includeSiblings,
            childAreaType
        );

        return area == null ? null : _areaMapper.Map(area);
    }

    public async Task<IList<AreaData>> GetAreaDetailsForAreaType(string areaTypeKey)
    {
        var areas = await _areaRepository.GetAreasForAreaTypeAsync(areaTypeKey);

        return _areaMapper.Map(areas);
    }

    public RootArea GetRootArea() =>
        new() { Name = "England", Code = "E92000001" };

    public static void RegisterMappings(IServiceCollection services) =>
        services.AddSingleton<IAreaMapper, AreaMapper>();
}