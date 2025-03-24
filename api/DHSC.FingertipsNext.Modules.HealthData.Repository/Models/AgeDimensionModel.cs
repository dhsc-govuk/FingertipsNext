using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AgeDimensionModel
{
    [Key]
    public short AgeKey { get; set; }

    [MaxLength(50)]
    public string Name { get; set; }

    public short AgeID { get; set; }

    public bool HasValue { get; set; }
}
