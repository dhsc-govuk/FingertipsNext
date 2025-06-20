using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class DeprivationDimensionModel
{
    [Key]
    public short DeprivationKey { get; set; }

    [MaxLength(100)]
    public required string Name { get; set; }

    [MaxLength(255)]
    public required string Type { get; set; }

    public bool HasValue { get; set; }

    public byte Sequence { get; set; }

    [NotMapped]
    public bool IsAggregate { get; set; }
}
