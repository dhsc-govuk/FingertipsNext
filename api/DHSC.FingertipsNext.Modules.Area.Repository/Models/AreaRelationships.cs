using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
[Serializable]
[Keyless]
[Table("AreaRelationships", Schema = "Areas")]
public class AreaRelationshipModel
{
    /// <summary>
    /// The parent area in the relationship
    /// </summary>
    [ForeignKey("AreaKey1")]
    public required AreaModel ParentAreaKey { get; set; }

    /// <summary>
    /// The child area in the relationship
    /// </summary>
    [ForeignKey("AreaKey2")]
    public required AreaModel ChildAreaKey { get; set; }
}