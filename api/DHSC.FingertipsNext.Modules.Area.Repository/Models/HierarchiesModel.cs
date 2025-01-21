using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

public class HierarchiesModel
{
    /// <summary>
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    [Key]
    public required string HierarchyType { get; set; }
}