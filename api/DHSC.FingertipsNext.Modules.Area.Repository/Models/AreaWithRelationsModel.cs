namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;
public class AreaWithRelationsModel
{
    public required AreaModel Area { get; init; }
    public List<AreaModel> ParentAreas { get; set; } = new ();
    public List<AreaModel> Children { get; set; } = new ();
    public List<AreaModel> Siblings  { get; set; } = new ();
}
