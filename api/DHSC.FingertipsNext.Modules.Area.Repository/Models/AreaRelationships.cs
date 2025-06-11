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
    public required int ParentAreaKey { get; init; }
    public required AreaModel Parent { get; init; }

    /// <summary>
    /// The child area in the relationship
    /// </summary>
    [ForeignKey("ChildAreaKey")]
    public required int ChildAreaKey { get; init; }

    public required AreaModel Child { get; init; }
}
