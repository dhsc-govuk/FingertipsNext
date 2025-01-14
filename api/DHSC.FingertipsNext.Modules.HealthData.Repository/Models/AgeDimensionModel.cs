using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AgeDimensionModel
{
    [Key]
    public required short AgeKey { get; set; }
    [MaxLength(50)]
    public required string Name { get; set; }
    public required short AgeID { get; set; }
}
