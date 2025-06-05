using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;
using DHSC.FingertipsNext.Modules.AreaData.Schemas;

namespace DHSC.FingertipsNext.Modules.AreaData.Service;

public interface IAreaMapper
{
    AreaType Map(AreaTypeModel source);
    IList<AreaType> Map(IList<AreaTypeModel> source);
    AreaWithRelations Map(AreaWithRelationsModel source);
    Schemas.Area Map(AreaModel source);
    IList<Schemas.Area> Map(IList<AreaModel> source);
    RootArea MapToRootArea(AreaModel source);
}

public class AreaMapper : IAreaMapper
{
    public AreaType Map(AreaTypeModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new AreaType
        {
            Key = source.AreaTypeKey,
            Name = source.AreaTypeName,
            HierarchyName = source.HierarchyType,
            Level = source.Level,
        };
    }

    public IList<AreaType> Map(IList<AreaTypeModel> source)
    {
        return source.Select(Map).ToList();
    }

    public AreaWithRelations Map(AreaWithRelationsModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        var area = Map(source.Area);

        return new AreaWithRelations
        {
            Code = area.Code,
            Name = area.Name,
            AreaType = area.AreaType,
            Parents = Map(source.ParentAreas),
            Children = Map(source.Children),
            Siblings = Map(source.Siblings)
        };
    }

    public Schemas.Area Map(AreaModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new Schemas.Area
        {
            Code = source.AreaCode,
            Name = source.AreaName,
            AreaType = Map(source.AreaType)
        };
    }

    public IList<Schemas.Area> Map(IList<AreaModel> source)
    {
        return source.Select(Map).ToList();
    }

    public RootArea MapToRootArea(AreaModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new RootArea
        {
            Code = source.AreaCode,
            Name = source.AreaName
        };
    }
}
