using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AreaDimensionModel
{
    [Key]
    public int AreaKey { get; set; }

    [MaxLength(20)]
    public required string Code { get; set; }

    [MaxLength(255)]
    public required string Name { get; set; }

}
