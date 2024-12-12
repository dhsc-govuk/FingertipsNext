using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

namespace DHSC.FingertipsNext.Modules.Indicators.Services;

/// <summary>
///
/// </summary>
public class IndicatorDataProvider : IIndicatorsDataProvider
{
    // TODO: FTN-?? - replace hard coded data and logic with something that fetches real data from database
    
    public Task<IEnumerable<HealthDataForArea>> GetIndicatorData(
        int indicatorId,
        string[] areaCodes,
        int[] years
    )
    {
        if (!HardCodedData.SampleIndicatorIds.Contains(indicatorId))
            return Task.FromResult((IEnumerable<HealthDataForArea>)[]);

        Func<string, bool> isAreacodeToReturn = ac =>
            areaCodes.Length == 0 || areaCodes.Contains(ac);

        Func<HealthDataPoint, bool> isYearToReturn = dataPoint =>
            years.Length == 0 || years.Contains(dataPoint.Year);

        return Task.FromResult(
            HardCodedData
                .SampleAreaCodes.Where(isAreacodeToReturn)
                .Select(areaCode => new HealthDataForArea
                {
                    AreaCode = areaCode,
                    HealthData = HardCodedData
                        .SampleDatapointsForAllAreas.Where(isYearToReturn)
                        .ToArray(),
                })
        );
    }
}

static class HardCodedData
{
    public static readonly int[] SampleIndicatorIds =
    [
        100,
        200,
        300,
        999,
        1000,
        2000,
        10000,
        222222,
        3333333,
        44444444,
    ];

    public static readonly string[] SampleAreaCodes =
    [
        "AA1 1AA",
        "WF10 4TA",
        "SW1A 1AA",
        "LS1 4HR",
    ];

    public static readonly HealthDataPoint[] SampleDatapointsForAllAreas =
    [
        new()
        {
            Year = 1970,
            Count = 2,
            Value = 31,
            LowerConfidenceInterval = 0.7f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 1980,
            Count = 3,
            Value = 37,
            LowerConfidenceInterval = 0.8f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 1990,
            Count = 5,
            Value = 41,
            LowerConfidenceInterval = 0.9f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 2000,
            Count = 7,
            Value = 43,
            LowerConfidenceInterval = 0.91f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 2010,
            Count = 11,
            Value = 47,
            LowerConfidenceInterval = 0.92f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 2020,
            Count = 13,
            Value = 53,
            LowerConfidenceInterval = 0.93f,
            UpperConfidenceInterval = 0.999f,
        },
        new()
        {
            Year = 2022,
            Count = 17,
            Value = 59,
            LowerConfidenceInterval = 0.94f,
            UpperConfidenceInterval = 0.999f,
        },
    ];
}
