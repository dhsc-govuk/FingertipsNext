using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class DeprivationDimensionModel
{
    [Key]
    public short DeprivationKey { get; set; }
    [MaxLength(100)]
    public string Name { get; set; }
    [MaxLength(255)]
    public string Type { get; set; }
    public bool HasValue { get; set; }
    public byte Sequence { get; set; }
}
