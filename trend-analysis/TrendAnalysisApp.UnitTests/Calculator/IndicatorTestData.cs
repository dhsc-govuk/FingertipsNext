using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.UnitTests.Calculator;

public class IndicatorTestData
{
    public static readonly IndicatorDimensionModel DiabetesPrevalence = new()
    {
        Name = "Diabetes prevalence aged 17 years and over (Quality and Outcomes Framework)",
        IndicatorId = 241,
        IndicatorKey = 123,
        Polarity = "No judgement",
        ValueType = "Proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> DiabetesPrevelanceHealthMeasurePoints =
    [
        new()
        {
            Count = 3938080,
            Value = 7.6554,
            Denominator = 51441896,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2024,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 7.6481,
            UpperCI = 7.6669
        },
        new()
        {
            Count = 3774801,
            Value = 7.4528,
            Denominator = 50649129,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2023,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 7.4456,
            UpperCI = 7.4643
        },
        new()
        {
            Count = 3625401,
            Value = 7.2571,
            Denominator = 49956777,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2022,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 7.2499,
            UpperCI = 7.2684
        },
        new()
        {
            Count = 3491868,
            Value = 7.1085,
            Denominator = 49122259,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2021,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 7.1013,
            UpperCI = 7.1199
        },
        new()
        {
            Count = 3455176,
            Value = 7.0826,
            Denominator = 48783947,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2020,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 7.0754,
            UpperCI = 7.094
        }
    ];

    public static readonly IndicatorDimensionModel GpRegisteredPopulationOver65 = new()
    {
        Name = "Proportion of GP registered populations by age group",
        IndicatorId = 93468,
        IndicatorKey = 1234,
        Polarity = "No judgement",
        ValueType = "Proportion"
    };

    public static readonly IEnumerable<HealthMeasureModel> GpRegisteredPopulationOver65HealthMeasurePoints =
    [
        new()
        {
            Count = 11246440,
            Value = 17.7872,
            Denominator = 63227624,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2024,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
        },
        new()
        {
            Count = 11034431,
            Value = 17.6782,
            Denominator = 62418295,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2023, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" }        },
        new()
        {
            Count = 10851467,
            Value = 17.6087,
            Denominator = 61625745,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2022, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
        },
        new()
        {
            Count = 10547929,
            Value = 17.3646,
            Denominator = 60744002,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2021, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" }
        },
        new()
        {
            Count = 10588957,
            Value = 17.5144,
            Denominator = 60458658,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2020, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" }
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
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2024, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 89.8578,
            UpperCI = 90.3396
        },
        new()
        {
            Count = 51767,
            Value = 90.017,
            Denominator = 57508,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2023, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 89.7694,
            UpperCI = 90.2594
        },
        new()
        {
            Count = 53681,
            Value = 90.8708,
            Denominator = 59074,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2022, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 90.6358,
            UpperCI = 91.1004
        },
        new()
        {
            Count = 55865,
            Value = 92.3221,
            Denominator = 60511,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2021, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 92.1072,
            UpperCI = 92.5315
        },
        new()
        {
            Count = 57274,
            Value = 92.6254,
            Denominator = 61834,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2020, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
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
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2024, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 2.8616,
            UpperCI = 3.1683
        },
        new()
        {
            Count = 1415,
            Value = 2.8701,
            Denominator = 49300918,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2023, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 2.7225,
            UpperCI = 3.0237
        },
        new()
        {
            Count = 1344,
            Value = 2.7567,
            Denominator = 48753376,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2022, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 2.6113,
            UpperCI = 2.9082
        },
        new()
        {
            Count = 935,
            Value = 1.93028,
            Denominator = 48440507,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2021, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 1.8085,
            UpperCI = 2.058
        },
        new()
        {
            Count = 1416,
            Value = 2.935,
            Denominator = 48246126,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2020, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
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
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2024, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 14.8,
            UpperCI = 14.8
        },
        new()
        {
            Count = 835533,
            Value = 14.2,
            Denominator = 5892913,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2023, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 14.1,
            UpperCI = 14.2
        },
        new()
        {
            Count = 861406,
            Value = 14.3,
            Denominator = 6006520,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2022, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 14.3,
            UpperCI = 14.4
        },
        new()
        {
            Count = 772357,
            Value = 15.4,
            Denominator = 5004131,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2021, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
            LowerCI = 15.4,
            UpperCI = 15.5
        },
        new()
        {
            Count = 927525,
            Value = 14.3,
            Denominator = 6490048,
            ToDateDimension = new DateDimensionModel { Date = new DateTime(2020, 12, 31) },
            PeriodDimension = new PeriodDimensionModel { Period = "yearly" },
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
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2023,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 119.8035,
            UpperCI = 121.7507
        },
        new()
        {
            Count = 60192,
            Value = 122.3782,
            Denominator = 51966274,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2022,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 121.4012,
            UpperCI = 123.361
        },
        new()
        {
            Count = 60202,
            Value = 121.5234,
            Denominator = 51653460,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2021,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 120.5533,
            UpperCI = 122.4993
        },
        new()
        {
            Count = 61740,
            Value = 125.829,
            Denominator = 51530437,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2020,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 124.8371,
            UpperCI = 126.8268
        },
        new()
        {
            Count = 61807,
            Value = 126.9341,
            Denominator = 51510878,
            ToDateDimension = new DateDimensionModel{ Date =  new DateTime(2019,12,31) },
            PeriodDimension = new PeriodDimensionModel{ Period = "yearly" },
            LowerCI = 125.9343,
            UpperCI = 127.94
        }
    ];
}
