namespace DHSC.FingertipsNext.Modules.AreaData.Repository.Models;
public class AreaWithRelationsModel
{
    public required AreaModel Area { get; init; }
    public IList<AreaModel> ParentAreas { get; init; } = [];
    public IList<AreaModel> Children { get; init; } = [];
    public IList<AreaModel> Siblings { get; init; } = [];
}
