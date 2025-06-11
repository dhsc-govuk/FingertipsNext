namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;
public class AreaWithRelationsModel
{
    public AreaModel Area { get; init; }
    public IList<AreaModel> ParentAreas { get; init; } = [];
    public IList<AreaModel> Children { get; init; } = [];
    public IList<AreaModel> Siblings { get; init; } = [];
}
