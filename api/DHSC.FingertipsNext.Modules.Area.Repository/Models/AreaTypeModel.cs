using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

public class AreaTypeModel
{
    /// <summary>
    /// The type of the area / geography
    /// </summary>
    [MaxLength(20)]
    public required string AreaType { get; set; }

    /// <summary>
    /// The name of the area / geography
    /// </summary>
    public required int Level { get; set; }

    /// <summary>
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    [MaxLength(20)]
    public required string HierarchyType { get; set; }
}