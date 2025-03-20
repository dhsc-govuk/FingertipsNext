using Shouldly;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;

namespace TrendAnalysisApp.UnitTests.Calculator;

public class TrendCalculatorTests
{
    private readonly TrendCalculator tc = new(new TrendMarkerCalculator(), new LegacyMapper());

    [Theory]
    [InlineData(Trend.Increasing, Constants.Polarity.NoJudgement)]
    [InlineData(Trend.NoChange, Constants.Polarity.HighIsGood)]
    [InlineData(Trend.CannotBeCalculated, Constants.Polarity.LowIsGood)]
    [InlineData(Trend.IncreasingAndGettingBetter, Constants.Polarity.LowIsGood)]
    public void TestTrendPolarityAdjustmentDoesNotAdjustWhenNotRequired(Trend trend, string polarity) {
        TrendCalculator.AdjustForPolarity(trend, polarity).ShouldBe(trend);
    }

    [Theory]
    [InlineData(Trend.Increasing, Constants.Polarity.HighIsGood, Trend.IncreasingAndGettingBetter)]
    [InlineData(Trend.Increasing, Constants.Polarity.LowIsGood, Trend.IncreasingAndGettingWorse)]
    [InlineData(Trend.Decreasing, Constants.Polarity.HighIsGood, Trend.DecreasingAndGettingWorse)]
    [InlineData(Trend.Decreasing, Constants.Polarity.LowIsGood, Trend.DecreasingAndGettingBetter)]
    public void TestTrendPolarityAdjustmentAdjustsCorrectly(
        Trend trend,
        string polarity,
        Trend adjustedTrend
    ) {
        TrendCalculator.AdjustForPolarity(trend, polarity).ShouldBe(adjustedTrend);
    }

    [Fact]
    public void TestDiabetesPrevalenceTrendIsCalculatedCorrectly() {
        // Indicator ID: 241 Diabetes prevalence aged 17 years and over (Quality and Outcomes Framework)
        // https://fingertips.phe.org.uk/search/Diabetes%20prevalance#page/4/gid/1/pat/159/par/K02000001/ati/15/are/E92000001/iid/241/age/187/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        // Values used are for whole population in England. Trend expected to be increasing as per website
        var result = tc.CalculateTrend(IndicatorTestData.DiabetesPrevalence, IndicatorTestData.DiabetesPrevelanceHealthMeasurePoints);

        result.ShouldBe(Trend.Increasing);
        result.ToString().ShouldBe("Increasing");
    }

    [Fact]
    public void TestGpRegisteredPopulationOver65TrendIsCalculatedCorrectly() {
        // Indicator ID: 93468 Proportion of GP registered populations by age group
        // https://fingertips.phe.org.uk/search/GP%20registered%20population#page/4/gid/1/pat/159/par/K02000001/ati/15/are/E92000001/iid/93468/age/27/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        // Values used are for whole population in England with age dimension of 65+ years. Trend expected to be No Change as per website
        var result = tc.CalculateTrend(
            IndicatorTestData.GpRegisteredPopulationOver65,
            IndicatorTestData.GpRegisteredPopulationOver65HealthMeasurePoints
        );

        result.ShouldBe(Trend.NoChange);
        result.ToString().ShouldBe("NoChange");
    }

    [Fact]
    public void TestYorkshireMmrCoverageTrendIsCalculatedCorrectly() {
        // Indicator ID: 30309 Population vaccination coverage: MMR for one dose (2 years old)
        // https://fingertips.phe.org.uk/profile/child-health-profiles/data#page/4/gid/1938133228/pat/15/ati/6/are/E12000003/iid/30309/age/31/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1/page-options/car-do-0
        // Values used are for Yorkshire and the Humber statistical region. Trend expected to be Decreasing as per website
        var result = tc.CalculateTrend(
            IndicatorTestData.YorkshireMmrCoverage,
            IndicatorTestData.YorkshireMmrCoverageHealthMeasurePoints
        );

        result.ShouldBe(Trend.DecreasingAndGettingWorse);
        result.ToString().ShouldBe("DecreasingAndGettingWorse");
    }

    [Fact]
    public void TestDiabeticEyeDiseaseTrendIsCalculatedCorrectly() {
        // 41203 Preventable sight loss from diabetic eye disease (uses crude rate rather than proportion)
        // https://fingertips.phe.org.uk/search/preventable%20eye#page/6/gid/1000044/pat/159/par/K02000001/ati/15/are/E92000001/iid/41203/age/227/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        // Values used are for all of England. Trend expected to be Increasing as per website
        var result = tc.CalculateTrend(
            IndicatorTestData.DiabeticEyeDisease,
            IndicatorTestData.DiabeticEyeDiseaseHealthMeasurePoints
        );

        result.ShouldBe(Trend.IncreasingAndGettingWorse);
        result.ToString().ShouldBe("IncreasingAndGettingWorse");
    }

    [Fact]
    public void TestIdentifierWithNonSupportedValueTypeReturnsNoTrend() {
        // This indicator uses a Value Type: Indirectly standardised proportion, which is not supported for trends
        // 41101 Emergency readmissions within 30 days of discharge from hospital
        // https://fingertips.phe.org.uk/search/Emergency%20readmissions%20within%2030%20days%20of%20discharge%20from%20hospital#page/6/gid/1000044/pat/159/par/K02000001/ati/15/are/E92000001/iid/41101/age/1/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        // Values used are for all of England. Trend should not be possible to calculate due to value type
        var result = tc.CalculateTrend(
            IndicatorTestData.EmergencyReadmissions,
            IndicatorTestData.EmergencyReadmissionsHealthMeasurePoints
        );

        result.ShouldBe(Trend.CannotBeCalculated);
        result.ToString().ShouldBe("CannotBeCalculated");
    }

    [Fact]
    public void TestCancerMortalityTrendIsCalculatedCorrectly() {
        // 40501 Under 75 mortality rate from cancer (uses value type of 'Directly standardised rate)
        // https://fingertips.phe.org.uk/search/Under%2075%20mortality%20rate%20from%20cancer#page/6/gid/1938132696/pat/159/par/K02000001/ati/15/are/E92000001/iid/40501/age/163/sex/4/cat/-1/ctp/-1/yrr/1/cid/4/tbm/1
        // Values used are for all of England u-75 (Persons, 1 year range). Trend should be decreasing
        var result = tc.CalculateTrend(
            IndicatorTestData.Under75CancerMortality,
            IndicatorTestData.Under75CancerMortalityHealthMeasurePoints
        );

        result.ShouldBe(Trend.DecreasingAndGettingBetter);
        result.ToString().ShouldBe("DecreasingAndGettingBetter");
    }

    [Fact]
    public void TestTrendCannotBeCalculatedWhenInsufficientDataPointsProvided() {
        // A minimum of 5 data points is required to calculate a trend
        var result = tc.CalculateTrend(
            IndicatorTestData.Under75CancerMortality,
            IndicatorTestData.Under75CancerMortalityHealthMeasurePoints.Skip(1)
        );

        result.ShouldBe(Trend.CannotBeCalculated);
        result.ToString().ShouldBe("CannotBeCalculated");
    }
}
