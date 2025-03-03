using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Calculator.Legacy.Models;
using Shouldly;
using Xunit.Abstractions;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Trends;

public class TrendMarkerCalculatorTests
{
    private readonly ITestOutputHelper output;

    public TrendMarkerCalculatorTests(ITestOutputHelper output)
    {
        this.output = output;
    }
    
    [Fact]
    public void CheckDiabetesTrendMarkersAreCorrect()
    {
        // 241 Diabetes: QOF prevalence
        // https://fingertips.phe.org.uk/profile/diabetes-ft/data#page/6/gid/1938133138/pat/159/par/K02000001/ati/15/are/E92000001/iid/241/age/187/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        var trendRequest = GenerateDiabetesTrendRequest();
        
        TrendMarkerCalculator tc = new TrendMarkerCalculator();
        var result = tc.GetResults(trendRequest);
        
        result.Message.ShouldBe("");
        result.Marker.ToString().ShouldBe("Increasing");
    }

    private TrendRequest GenerateDiabetesTrendRequest()
    {
        var trendRequest = new TrendRequest();
        trendRequest.ValueTypeId = ValueTypeId.Proportion;
        trendRequest.ComparatorMethodId = ComparatorMethodIds.SpcForProportions;
        trendRequest.YearRange = 1; // -> Must be == 1
        
        trendRequest.Data = new List<CoreDataSet>
        {
            new()
            {
                Count = 3938080,
                Value = 7.6554,
                Denominator = 51441896,
                Year = 2024,
                LowerCI95 = 7.6481,
                UpperCI95 = 7.6669
            },
            new()
            {
                Count = 3774801,
                Value = 7.4528,
                Denominator = 50649129,
                Year = 2023,
                LowerCI95 = 7.4456,
                UpperCI95 = 7.4643
            },
            new()
            {
                Count = 3625401,
                Value = 7.2571,
                Denominator = 49956777,
                Year = 2022,
                LowerCI95 = 7.2499,
                UpperCI95 = 7.2684
            },
            new()
            {
                Count = 3491868,
                Value = 7.1085,
                Denominator = 49122259,
                Year = 2021,
                LowerCI95 = 7.1013,
                UpperCI95 = 7.1199
            },
            new()
            {
                Count = 3455176,
                Value = 7.0826,
                Denominator = 48783947,
                Year = 2020,
                LowerCI95 = 7.0754,
                UpperCI95 = 7.094
            }
        };

        return trendRequest;
    }
    
    
    [Fact]
    public void CheckGPRegisteredPopulationTrendMarkersAreCorrect()
    {
        // 93468 Proportion of GP registered populations by age group (65+ yrs)
        // https://fingertips.phe.org.uk/profile/diabetes-ft/data#page/4/gid/1938133138/pat/159/par/K02000001/ati/15/are/E92000001/iid/93468/age/27/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        var trendRequest = GenerateGPRegisteredPopulationTrendRequest();
        
        TrendMarkerCalculator tc = new TrendMarkerCalculator();
        var result = tc.GetResults(trendRequest);
        
        output.WriteLine($"Message: {result.Message}");
        output.WriteLine($"Chi2: {result.ChiSquare}");
        output.WriteLine($"Marker: {result.Marker.ToString()}");
        result.Message.ShouldBe("");
        result.Marker.ToString().ShouldBe("NoChange");
    }

    private TrendRequest GenerateGPRegisteredPopulationTrendRequest()
    {
        var trendRequest = new TrendRequest();
        trendRequest.ValueTypeId = ValueTypeId.Proportion;
        trendRequest.ComparatorMethodId = ComparatorMethodIds.SpcForProportions;
        trendRequest.YearRange = 1; // -> Must be == 1
        
        trendRequest.Data = new List<CoreDataSet>
        {
            new()
            {
                Count = 11246440,
                Value = 17.7872,
                Denominator = 63227624,
                Year = 2024
            },new()
            {
                Count = 11034431,
                Value = 17.6782,
                Denominator = 62418295,
                Year = 2023,
            },new()
            {
                Count = 10851467,
                Value = 17.6087,
                Denominator = 61625745,
                Year = 2022,
            },new()
            {
                Count = 10547929,
                Value = 17.3646,
                Denominator = 60744002,
                Year = 2021
            },new()
            {
                Count = 10588957, 
                Value = 17.5144, 
                Denominator = 60458658,
                Year = 2020
            },
        };

        return trendRequest;
    }

    [Fact]
    public void GenerateYorkshireMmrCoverageTrendMarkersAreCorrect()
    {
        // 30309 Population vaccination coverage: MMR for one dose (2 years old) - data for Yorkshire and the Humber
        // https://fingertips.phe.org.uk/profile/child-health-profiles/data#page/6/gid/1938133228/pat/15/par/E92000001/ati/6/are/E12000005/iid/30309/age/31/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1/page-options/car-do-0
        var trendRequest = GenerateYorkshireMmrCoverageTrendRequest();
        
        TrendMarkerCalculator tc = new TrendMarkerCalculator();
        var result = tc.GetResults(trendRequest);
        
        output.WriteLine($"Message: {result.Message}");
        output.WriteLine($"Chi2: {result.ChiSquare}");
        output.WriteLine($"Marker: {result.Marker.ToString()}");
        result.Message.ShouldBe("");
        result.Marker.ToString().ShouldBe("Decreasing");
    }

    private TrendRequest GenerateYorkshireMmrCoverageTrendRequest()
    {
        var trendRequest = new TrendRequest();
        trendRequest.ValueTypeId = ValueTypeId.Proportion;
        trendRequest.ComparatorMethodId = ComparatorMethodIds.SpcForProportions;
        trendRequest.YearRange = 1; // -> Must be == 1
        
        trendRequest.Data = new List<CoreDataSet>
        {
            new()
            {
                Count = 53185,
                Value = 90.1013,
                Denominator = 59028,
                Year = 2024,
                LowerCI95 = 89.8578,
                UpperCI95 = 90.3396
            },
            new()
            {
                Count = 51767,
                Value = 90.017,
                Denominator = 57508,
                Year = 2023,
                LowerCI95 = 89.7694,
                UpperCI95 = 90.2594
            },
            new()
            {
                Count = 53681,
                Value = 90.8708,
                Denominator = 59074,
                Year = 2022,
                LowerCI95 = 90.6358,
                UpperCI95 = 91.1004
            },
            new()
            {
                Count = 55865,
                Value = 92.3221,
                Denominator = 60511,
                Year = 2021,
                LowerCI95 = 92.1072,
                UpperCI95 = 92.5315
            },
            new()
            {
                Count = 57274,
                Value = 92.6254,
                Denominator = 61834,
                Year = 2020,
                LowerCI95 = 92.4168,
                UpperCI95 = 92.8288
            }
        };

        return trendRequest;
    }

    [Fact]
    public void DiabeticEyeDiseaseTrendMarkersAreCorrect()
    {
        // 41203 Preventable sight loss from diabetic eye disease (uses crude rate rather than proportion)
        // https://fingertips.phe.org.uk/search/diabetic%20eye%20disease#page/6/gid/1/pat/159/par/K02000001/ati/15/are/E92000001/iid/41203/age/227/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1/page-options/tre-ao-1
        var trendRequest = GenerateDiabeticEyeDiseaseTrendRequest();
        
        TrendMarkerCalculator tc = new TrendMarkerCalculator();
        var result = tc.GetResults(trendRequest);
        
        output.WriteLine($"Message: {result.Message}");
        output.WriteLine($"Chi2: {result.ChiSquare}");
        output.WriteLine($"Marker: {result.Marker.ToString()}");
        result.Message.ShouldBe("");
        result.Marker.ToString().ShouldBe("Increasing");
    }

    private TrendRequest GenerateDiabeticEyeDiseaseTrendRequest()
    {
        var trendRequest = new TrendRequest();
        trendRequest.ValueTypeId = ValueTypeId.CrudeRate;
        trendRequest.YearRange = 1; // -> Must be == 1
        
        trendRequest.Data = new List<CoreDataSet>
        {
            new()
            {
                Count = 1502,
                Value = 3.0121,
                Denominator = 49866388,
                Year = 2024,
                LowerCI95 = 2.8616,
                UpperCI95 = 3.1683
            },
            new()
            {
                Count = 1415,
                Value = 2.8701,
                Denominator = 49300918,
                Year = 2023,
                LowerCI95 = 2.7225,
                UpperCI95 = 3.0237
            },
            new()
            {
                Count = 1344,
                Value = 2.7567,
                Denominator = 48753376,
                Year = 2022,
                LowerCI95 = 2.6113,
                UpperCI95 = 2.9082
            },
            new()
            {
                Count = 935,
                Value = 1.93028,
                Denominator = 48440507,
                Year = 2021,
                LowerCI95 = 1.8085,
                UpperCI95 = 2.058
            },
            new()
            {
                Count = 1416,
                Value = 2.935,
                Denominator = 48246126,
                Year = 2020,
                LowerCI95 = 2.7841,
                UpperCI95 = 3.0919
            }
        };

        return trendRequest;
    }
}