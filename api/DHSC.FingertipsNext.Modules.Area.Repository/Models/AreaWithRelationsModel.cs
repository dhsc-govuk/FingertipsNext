namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

public class AreaWithRelationsModel
{
    private List<AreaModel>? _parents;
    private List<AreaModel>? _children;
    private List<AreaModel>? _siblings;
    private List<AreaModel>? _ancestors;
    
    public required AreaModel Area { get; init; }
    public List<AreaModel> ParentAreas
    {
        get => _parents ?? new List<AreaModel>();
        set => _parents = value;
    }
    public List<AreaModel> Children
    {
        get => _children ?? new List<AreaModel>();
        set => _children = value; 
    }
    public List<AreaModel> Siblings
    {
        get => _siblings ?? new List<AreaModel>();
        set => _siblings = value; 
    }
    public List<AreaModel> Ancestors
    {
        get => _ancestors ?? new List<AreaModel>();
        set => _ancestors = value; 
    }
}
