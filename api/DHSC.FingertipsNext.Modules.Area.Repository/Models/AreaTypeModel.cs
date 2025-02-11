using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area type that has associated public health data
/// </summary>
[Serializable]
[Table("AreaTypes", Schema = "Areas")]
public class AreaTypeModel
{
    /// <summary
    /// The database key for the area
    /// </summary>
    [Key]
    [MaxLength(50)]
    public required string AreaTypeKey { get; set; }

    /// <summary>
    /// The level of the area type in the hierarchy
    /// </summary>
    public required int Level { get; set; }

    /// <summary>
    /// The name of the associated hierarchy for the area type
    /// </summary>
    [MaxLength(20)]
    public required string HierarchyType { get; set; }

    /// <summary>
    /// The name of the area type for display
    /// </summary>
    [MaxLength(50)]
    public required string AreaTypeName { get; set; }

}