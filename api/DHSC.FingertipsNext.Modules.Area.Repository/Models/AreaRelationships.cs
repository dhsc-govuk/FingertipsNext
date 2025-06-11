using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
[Keyless]
[Table("AreaRelationships", Schema = "Areas")]
public class AreaRelationshipModel
{
    /// <summary>
    /// The parent area in the relationship
    /// </summary>
    [ForeignKey("ParentAreaKey")]
    public int ParentAreaKey { get; init; }
    public AreaModel Parent { get; init; }

    /// <summary>
    /// The child area in the relationship
    /// </summary>
    [ForeignKey("ChildAreaKey")]
    public int ChildAreaKey { get; init; }

    public AreaModel Child { get; init; }
}
