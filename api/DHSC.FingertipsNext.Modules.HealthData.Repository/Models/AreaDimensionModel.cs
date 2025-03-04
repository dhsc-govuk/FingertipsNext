using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AreaDimensionModel
{
    [Key]
    public int AreaKey { get; set; }
    [MaxLength(20)]
    public string Code { get; set; }
    [MaxLength(255)]
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
