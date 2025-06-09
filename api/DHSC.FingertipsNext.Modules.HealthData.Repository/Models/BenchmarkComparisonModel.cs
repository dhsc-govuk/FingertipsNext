using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Keyless]
[Serializable]

public class BenchmarkComparisonModel
{
    public string Outcome { get; set; }

    public string BenchmarkAreaCode { get; set; }

    public string BenchmarkAreaName { get; set; }
}
