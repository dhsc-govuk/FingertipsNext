using DHSC.FingertipsNext.Modules.HealthData.TrendCalculator.Legacy;
using DHSC.FingertipsNext.Modules.HealthData.TrendCalculator.Legacy.Models;
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
        
        output.WriteLine($"Message: {result.Message}");
        output.WriteLine($"Chi2: {result.ChiSquare}");
        output.WriteLine($"Marker: {result.Marker.ToString()}");
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
}