using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// A area or geography that has associated public health data
/// </summary>
[Serializable]
public class AreaModel
{
    /// <summary>
    /// The unique area code of the area / geography
    /// </summary>
    [MaxLength(20)]
    [Key]
    public required string AreaCode { get; set; }

    /// <summary>
    /// The name of the area / geography
    /// </summary>
    public int Level { get; set; }

    /// <summary>
    /// 
    /// </summary>
    [MaxLength(255)]
    public required string AreaName { get; set; }

    /// <summary>
    /// The type of the area / geography
    /// </summary>
    public required string AreaType { get; set; }

    /// <summary>
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    public required string HierarchyType { get; set; }
}