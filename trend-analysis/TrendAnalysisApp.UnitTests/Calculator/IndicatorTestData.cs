using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.UnitTests.Calculator;

public class IndicatorTestData
{
    public static readonly IndicatorDimensionModel DiabetesPrevalence = new()
    {
        Name = "Diabetes prevalence aged 17 years and over (Quality and Outcomes Framework)",
        IndicatorId = 241,
        IndicatorKey = 123,
        Polarity = "Not applicable",
        ValueType = "Proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> DiabetesPrevelanceHealthMeasurePoints =
    [
        new()
        {
            Count = 3938080,
            Value = 7.6554,
            Denominator = 51441896,
            Year = 2024,
            LowerCI = 7.6481,
            UpperCI = 7.6669
        },
        new()
        {
            Count = 3774801,
            Value = 7.4528,
            Denominator = 50649129,
            Year = 2023,
            LowerCI = 7.4456,
            UpperCI = 7.4643
        },
        new()
        {
            Count = 3625401,
            Value = 7.2571,
            Denominator = 49956777,
            Year = 2022,
            LowerCI = 7.2499,
            UpperCI = 7.2684
        },
        new()
        {
            Count = 3491868,
            Value = 7.1085,
            Denominator = 49122259,
            Year = 2021,
            LowerCI = 7.1013,
            UpperCI = 7.1199
        },
        new()
        {
            Count = 3455176,
            Value = 7.0826,
            Denominator = 48783947,
            Year = 2020,
            LowerCI = 7.0754,
            UpperCI = 7.094
        }
    ];

    public static readonly IndicatorDimensionModel GpRegisteredPopulationOver65 = new()
    {
        Name = "Proportion of GP registered populations by age group",
        IndicatorId = 93468,
        IndicatorKey = 1234,
        Polarity = "Not applicable",
        ValueType = "Proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> GpRegisteredPopulationOver65HealthMeasurePoints =
    [
        new()
        {
            Count = 11246440,
            Value = 17.7872,
            Denominator = 63227624,
            Year = 2024
        },
        new()
        {
            Count = 11034431,
            Value = 17.6782,
            Denominator = 62418295,
            Year = 2023,
        },
        new()
        {
            Count = 10851467,
            Value = 17.6087,
            Denominator = 61625745,
            Year = 2022,
        },
        new()
        {
            Count = 10547929,
            Value = 17.3646,
            Denominator = 60744002,
            Year = 2021
        },
        new()
        {
            Count = 10588957, 
            Value = 17.5144, 
            Denominator = 60458658,
            Year = 2020
        }
    ];

    public static readonly IndicatorDimensionModel YorkshireMmrCoverage = new()
    {
        Name = "Population vaccination coverage: MMR for one dose (2 years old)",
        IndicatorId = 30309,
        IndicatorKey = 12345,
        Polarity = "High is good",
        ValueType = "Proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> YorkshireMmrCoverageHealthMeasurePoints =
    [
        new()
        {
            Count = 53185,
            Value = 90.1013,
            Denominator = 59028,
            Year = 2024,
            LowerCI = 89.8578,
            UpperCI = 90.3396
        },
        new()
        {
            Count = 51767,
            Value = 90.017,
            Denominator = 57508,
            Year = 2023,
            LowerCI = 89.7694,
            UpperCI = 90.2594
        },
        new()
        {
            Count = 53681,
            Value = 90.8708,
            Denominator = 59074,
            Year = 2022,
            LowerCI = 90.6358,
            UpperCI = 91.1004
        },
        new()
        {
            Count = 55865,
            Value = 92.3221,
            Denominator = 60511,
            Year = 2021,
            LowerCI = 92.1072,
            UpperCI = 92.5315
        },
        new()
        {
            Count = 57274,
            Value = 92.6254,
            Denominator = 61834,
            Year = 2020,
            LowerCI = 92.4168,
            UpperCI = 92.8288
        }
    ];

    public static readonly IndicatorDimensionModel DiabeticEyeDisease = new()
    {
        Name = "Preventable sight loss from diabetic eye disease",
        IndicatorId = 41203,
        IndicatorKey = 12346,
        Polarity = "Low is good",
        ValueType = "Crude rate"
    };

    public static readonly IEnumerable<HealthMeasureModel> DiabeticEyeDiseaseHealthMeasurePoints =
    [
        new()
        {
            Count = 1502,
            Value = 3.0121,
            Denominator = 49866388,
            Year = 2024,
            LowerCI = 2.8616,
            UpperCI = 3.1683
        },
        new()
        {
            Count = 1415,
            Value = 2.8701,
            Denominator = 49300918,
            Year = 2023,
            LowerCI = 2.7225,
            UpperCI = 3.0237
        },
        new()
        {
            Count = 1344,
            Value = 2.7567,
            Denominator = 48753376,
            Year = 2022,
            LowerCI = 2.6113,
            UpperCI = 2.9082
        },
        new()
        {
            Count = 935,
            Value = 1.93028,
            Denominator = 48440507,
            Year = 2021,
            LowerCI = 1.8085,
            UpperCI = 2.058
        },
        new()
        {
            Count = 1416,
            Value = 2.935,
            Denominator = 48246126,
            Year = 2020,
            LowerCI = 2.7841,
            UpperCI = 3.0919
        }
    ];

    public static readonly IndicatorDimensionModel EmergencyReadmissions = new()
    {
        Name = "Emergency readmissions within 30 days of discharge from hospital",
        IndicatorId = 41101,
        IndicatorKey = 12342,
        Polarity = "Low is good",
        ValueType = "Indirectly standardised proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> EmergencyReadmissionsHealthMeasurePoints =
    [
        new()
        {
            Count = 939199,
            Value = 14.8,
            Denominator = 6340538,
            Year = 2024,
            LowerCI = 14.8,
            UpperCI = 14.8
        },
        new()
        {
            Count = 835533,
            Value = 14.2,
            Denominator = 5892913,
            Year = 2023,
            LowerCI = 14.1,
            UpperCI = 14.2
        },
        new()
        {
            Count = 861406,
            Value = 14.3,
            Denominator = 6006520,
            Year = 2022,
            LowerCI = 14.3,
            UpperCI = 14.4
        },
        new()
        {
            Count = 772357,
            Value = 15.4,
            Denominator = 5004131,
            Year = 2021,
            LowerCI = 15.4,
            UpperCI = 15.5
        },
        new()
        {
            Count = 927525,
            Value = 14.3,
            Denominator = 6490048,
            Year = 2020,
            LowerCI = 14.3,
            UpperCI = 14.3
        }
    ];

    public static readonly IndicatorDimensionModel Under75CancerMortality = new()
    {
        Name = "Under 75 mortality rate from cancer",
        IndicatorId = 40501,
        IndicatorKey = 357,
        Polarity = "Low is good",
        ValueType = "Directly standardised rate"
    };

    public static readonly IEnumerable<HealthMeasureModel> Under75CancerMortalityHealthMeasurePoints =
    [
        new()
        {
            Count = 59423,
            Value = 120/7742,
            Denominator = 52380101,
            Year = 2023,
            LowerCI = 119.8035,
            UpperCI = 121.7507
        },
        new()
        {
            Count = 60192,
            Value = 122.3782,
            Denominator = 51966274,
            Year = 2022,
            LowerCI = 121.4012,
            UpperCI = 123.361
        },
        new()
        {
            Count = 60202,
            Value = 121.5234,
            Denominator = 51653460,
            Year = 2021,
            LowerCI = 120.5533,
            UpperCI = 122.4993
        },
        new()
        {
            Count = 61740,
            Value = 125.829,
            Denominator = 51530437,
            Year = 2020,
            LowerCI = 124.8371,
            UpperCI = 126.8268
        },
        new()
        {
            Count = 61807,
            Value = 126.9341,
            Denominator = 51510878,
            Year = 2019,
            LowerCI = 125.9343,
            UpperCI = 127.94
        }
    ];
}
