using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// A denormalised version of area and area type 
/// - used when getting descendents in a recursive CTE
/// </summary>
public class DenormalisedAreaWithAreaTypeModel
{
    /// <summary>
    /// The unique area key of the area - this is a surrogate key
    /// </summary>
    [Key]
    public required int AreaKey { get; init; }

    /// <summary>
    /// The area code of the area - may not be unique because
    /// some areas are modeled as both a district and county level
    /// areaType in which case they have two entries in the DB
    /// </summary>
    [MaxLength(20)]
    public required string AreaCode { get; init; }

    /// <summary>
    /// The name of the area e.g. 'Derby'
    /// </summary>
    [MaxLength(255)]
    public required string AreaName { get; init; }

    /// <summary>
    /// 
    /// </summary>
    public required string AreaTypeKey { get; init; }

    /// <summary>
    /// The level of the area type in the hierarchy
    /// </summary>
    public required int Level { get; init; }

    /// <summary>
    /// The name of the associated hierarchy for the area type
    /// </summary>
    [MaxLength(20)]
    public required string HierarchyType { get; init; }

    /// <summary>
    /// The name of the area type for display
    /// </summary>
    [MaxLength(50)]
    public required string AreaTypeName { get; init; }

    /// <summary>
    /// This function converts back to an AreaModel with an AreaTypeModel
    /// </summary>
    public AreaModel Normalise() => new()
    {
        AreaKey = AreaKey,
        AreaCode = AreaCode,
        AreaName = AreaName,
        AreaTypeKey = AreaTypeKey,
        AreaType = new AreaTypeModel
        {
            AreaTypeKey = AreaTypeKey,
            AreaTypeName = AreaTypeName,
            HierarchyType = HierarchyType,
            Level = Level
        }
    };
}