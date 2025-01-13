using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AreaDimensionModel
{
    [Key]
    public required int AreaKey { get; set; }
    [MaxLength(20)]
    public required string Code { get; set; }
    [MaxLength(255)]
    public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}
