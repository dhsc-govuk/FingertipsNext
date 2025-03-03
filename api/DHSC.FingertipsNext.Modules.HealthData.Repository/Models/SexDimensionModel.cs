using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class SexDimensionModel
{
    [Key]
    public byte SexKey { get; set; }
    [MaxLength(50)]
    public string Name { get; set; }
    public bool IsFemale { get; set; }
    public bool HasValue { get; set; }
    public byte SexId { get; set; }
}
