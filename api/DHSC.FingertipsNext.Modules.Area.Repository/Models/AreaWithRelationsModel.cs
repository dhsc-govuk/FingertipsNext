namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

public class AreaWithRelationsModel
{
    private List<AreaModel>? _children;
    private List<AreaModel>? _ancestors;
    
    public required AreaModel Area { get; init; }
    public AreaModel? ParentArea { get; set; }
    public List<AreaModel> Children
    {
        get => _children ?? new List<AreaModel>();
        set => _children = value; 
    }
    public List<AreaModel> Ancestors
    {
        get => _ancestors ?? new List<AreaModel>();
        set => _ancestors = value; 
    }
}
