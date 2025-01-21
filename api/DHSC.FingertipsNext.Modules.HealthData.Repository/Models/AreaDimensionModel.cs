using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class AreaDimensionModel
{
    public AreaDimensionModel()
    {
    }

    [SetsRequiredMembers]
    public AreaDimensionModel(int areaKey, string code, string name, DateTime startDate, DateTime endDate)
    {
        AreaKey = areaKey;
        Code = code;
        Name = name;
        StartDate = startDate;
        EndDate = endDate;
    }

    [Key] public required int AreaKey { get; set; }
    [MaxLength(20)] public required string Code { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}