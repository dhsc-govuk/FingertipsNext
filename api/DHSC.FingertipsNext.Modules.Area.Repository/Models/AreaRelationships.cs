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
    [ForeignKey("ParentAreaKey")]
    public int ParentAreaKey { get; set; }
    public AreaModel Parent { get; set; }

    /// <summary>
    /// The child area in the relationship
    /// </summary>
    [ForeignKey("ChildAreaKey")]
    public int ChildAreaKey { get; set; }
    
    public AreaModel Child { get; set; }
}