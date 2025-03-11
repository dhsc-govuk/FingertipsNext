using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Keyless]

public class BenchmarkComparisonModel
{
    public string Outcome { get; set; }

    public string Method { get; set; }

    public string IndicatorPolarity { get; set; }

    public string BenchmarkAreaCode { get; set; }

    public string BenchmarkAreaName { get; set; }
    
}
