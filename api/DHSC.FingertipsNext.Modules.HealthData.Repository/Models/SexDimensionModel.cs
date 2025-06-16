using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class SexDimensionModel
{
    [Key]
    public byte SexKey { get; set; }

    [MaxLength(50)]
    public string Name { get; set; }

    public bool HasValue { get; set; }

    [NotMapped]
    public bool IsAggregate { get; set; }
}
