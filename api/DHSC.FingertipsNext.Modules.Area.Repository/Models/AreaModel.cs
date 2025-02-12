using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
[Serializable]
[Table("Areas", Schema = "Areas")]
public class AreaModel
{
    /// <summary>
    /// 
    /// </summary>
    [Key]
    public required HierarchyId Node { get; set; }

    /// <summary>
    /// The unique area code of the area / geography
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
    public required AreaTypeModel AreaType { get; set; }
    
    /// <summary>
    /// 
    /// </summary>
    [ForeignKey("AreaType")]
    public required string AreaTypeKey { get; set; }
}