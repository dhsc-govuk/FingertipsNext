using System.Globalization;
using System.Text.RegularExpressions;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

public enum BenchmarkComparisonMethod
{
    Unknown,
    Quintiles,
    CIOverlappingReferenceValue95,
    CIOverlappingReferenceValue99_8
}

