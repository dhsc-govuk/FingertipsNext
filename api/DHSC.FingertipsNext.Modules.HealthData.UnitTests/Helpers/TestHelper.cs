using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public static class TestHelper
{
    public static HealthDataPoint BuildHealthDataPoint(int year, string ageBand, string sex,  float count = 1, float value = 1, float lowerConfidenceInterval = 1, float upperConfidenceInterval = 1)
    {
        return new HealthDataPoint
        {
            Year = year,
            Count = count,
            Value = value,
            LowerConfidenceInterval = lowerConfidenceInterval,
            UpperConfidenceInterval = upperConfidenceInterval,
            AgeBand = ageBand,
            Sex = sex
        };

    }
}
