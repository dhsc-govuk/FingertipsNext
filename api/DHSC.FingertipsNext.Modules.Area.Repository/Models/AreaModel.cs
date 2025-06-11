using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
[Table("Areas", Schema = "Areas")]
public class AreaModel
{
    /// <summary>
    /// The unique area key of the area - this is a surrogate key
    /// </summary>
    [Key]
    public int AreaKey { get; init; }

    /// <summary>
    /// The area code of the area - may not be unique because
    /// some areas are modeled as both a district and county level
    /// areaType in which case they have two entries in the DB
    /// </summary>
    [MaxLength(20)]
    public string AreaCode { get; init; }

    /// <summary>
    /// The name of the area e.g. 'Derby'
    /// </summary>
    [MaxLength(255)]
    public string AreaName { get; init; }

    /// <summary>
    /// The type of the area e.g. 'Region'
    /// </summary>
    [ForeignKey("AreaTypeKey")]
    public AreaTypeModel AreaType { get; init; }

    [MaxLength(50)]
    public string AreaTypeKey { get; init; }

    public virtual ICollection<AreaModel> Children { get; init; } = [];

    public virtual ICollection<AreaModel> Parents { get; init; } = [];
}