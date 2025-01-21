using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Area.Repository.Models;

[Serializable]
public class AreaTypesModel
{
    /// <summary>
    /// The type of the area / geography
    /// </summary>
    [Key]
    public required string AreaType { get; set; }
}