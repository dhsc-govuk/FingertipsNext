using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
[Serializable]
[Table("Areas", Schema = "Areas")]
public class AreaModel
{

    /// <summary>
    /// The unique area key of the area - this is a surrogate key
    /// </summary>
    [Key]
    public required int AreaKey { get; set; }

    /// <summary>
    /// The area code of the area - may not be unique because
    /// some areas are modeled as both a district and county level
    /// areaType in which case they have two entries in the DB
    /// </summary>
    [MaxLength(20)]
    public required string AreaCode { get; set; }

    /// <summary>
    /// The name of the area e.g. 'Derby'
    /// </summary>
    [MaxLength(255)]
    public required string AreaName { get; set; }

    /// <summary>
    /// The type of the area e.g. 'Region'
    /// </summary>
    [ForeignKey("AreaTypeKey")]
    public required AreaTypeModel AreaType { get; set; }
    
    /// <summary>
    /// 
    /// </summary>
    [MaxLength(50)]
    public required string AreaTypeKey { get; set; }
    
    public virtual ICollection<AreaModel> Children { get; set; }
    
    public virtual ICollection<AreaModel> Parents { get; set; }
}