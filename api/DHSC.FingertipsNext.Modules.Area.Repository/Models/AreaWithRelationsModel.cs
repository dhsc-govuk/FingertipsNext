namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

public class AreaWithRelationsModel
{
    public required AreaModel Area { get; init; }
    public AreaModel? ParentArea { get; set; } = null;
    public AreaModel[] Children { get; set; } = [];
    public AreaModel[] Ancestors { get; set; } = [];
}