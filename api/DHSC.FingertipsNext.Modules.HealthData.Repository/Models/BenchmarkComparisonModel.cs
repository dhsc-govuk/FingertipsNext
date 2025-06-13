using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Keyless]
[Serializable]

public class BenchmarkComparisonModel
{
    public required string Outcome { get; set; }

    public required string BenchmarkAreaCode { get; set; }

    public required string BenchmarkAreaName { get; set; }
}
