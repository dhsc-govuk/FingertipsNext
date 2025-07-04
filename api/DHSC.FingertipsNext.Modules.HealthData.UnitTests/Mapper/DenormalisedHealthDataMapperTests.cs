using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Mapper;

public class DenormalisedHealthDataMapperTests
{
    [Fact]
    public void MapperShouldMapADenormalisedHealthMeasureToAHealthDataPoint()
    {
        DenormalisedHealthMeasureModel denormalisedHealthMeasure = new DenormalisedHealthMeasureModel
        {
            HealthMeasureKey = 1,
            AreaDimensionCode = "SomeCode",
            AreaDimensionName = "Name",
            IndicatorDimensionName = "IndicatorName",
            SexDimensionName = "Male",
            SexDimensionHasValue = true,
            SexDimensionIsAggregate = true,
            TrendDimensionName = "Trend",
            AgeDimensionName = "0-4",
            AgeDimensionHasValue = true,
            AgeDimensionIsAggregate = true,
            DeprivationDimensionName = "Most deprived",
            DeprivationDimensionType = "Decile",
            DeprivationDimensionSequence = 1,
            DeprivationDimensionHasValue = true,
            DeprivationDimensionIsAggregate = true,
            Count = 1000,
            Value = 5,
            LowerCi = 3,
            UpperCi = 6,
            Year = 2024,
            FromDate = new DateTime(2024, 1, 1),
            ToDate = new DateTime(2024, 12, 31),
            PeriodType = "Calendar",
            ReportingPeriod = "Yearly",
            BenchmarkComparisonIndicatorPolarity = "High is good",
            BenchmarkComparisonAreaCode = "E92000001",
            BenchmarkComparisonAreaName = "England"
        };

        HealthDataPoint expectedHealthData = new()
        {
            Year = 2024,
            DatePeriod = new DatePeriod
            {
                From = new DateOnly(2024, 1, 1),
                To = new DateOnly(2024, 12, 31),
                PeriodType = DatePeriodType.Calendar
            },
            Count = 1000,
            Value = 5,
            LowerConfidenceInterval = 3,
            UpperConfidenceInterval = 6,
            AgeBand = new Age
            {
                Value = "0-4",
                IsAggregate = true
            },
            Deprivation = new Deprivation
            {
                Value = "Most deprived",
                Type = "Decile",
                Sequence = 1,
                IsAggregate = true
            },
            Sex = new Sex
            {
                Value = "Male",
                IsAggregate = true
            },
            Trend = "Trend",
            IsAggregate = true,
        };

        var actual = Mappings.HealthDataMapper.Map(denormalisedHealthMeasure);

        actual.ShouldBeEquivalentTo(expectedHealthData);
    }


    [Fact]
    public void MapperShouldHandleDisaggregatePoints()
    {
        DenormalisedHealthMeasureModel denormalisedHealthMeasure = new DenormalisedHealthMeasureModel
        {
            HealthMeasureKey = 1,
            AreaDimensionCode = "SomeCode",
            AreaDimensionName = "Name",
            IndicatorDimensionName = "IndicatorName",
            SexDimensionName = "Male",
            SexDimensionHasValue = true,
            SexDimensionIsAggregate = false,
            TrendDimensionName = "Trend",
            AgeDimensionName = "0-4",
            AgeDimensionHasValue = true,
            AgeDimensionIsAggregate = true,
            DeprivationDimensionName = "Most deprived",
            DeprivationDimensionType = "Decile",
            DeprivationDimensionSequence = 1,
            DeprivationDimensionHasValue = true,
            DeprivationDimensionIsAggregate = true,
            Count = 1000,
            Value = 5,
            LowerCi = 3,
            UpperCi = 6,
            Year = 2024,
            FromDate = new DateTime(2024, 1, 1),
            ToDate = new DateTime(2024, 12, 31),
            PeriodType = "Calendar",
            ReportingPeriod = "Yearly",
            BenchmarkComparisonIndicatorPolarity = "High is good",
            BenchmarkComparisonAreaCode = "E92000001",
            BenchmarkComparisonAreaName = "England"
        };

        HealthDataPoint expectedHealthData = new()
        {
            Year = 2024,
            DatePeriod = new DatePeriod
            {
                From = new DateOnly(2024, 1, 1),
                To = new DateOnly(2024, 12, 31),
                PeriodType = DatePeriodType.Calendar
            },
            Count = 1000,
            Value = 5,
            LowerConfidenceInterval = 3,
            UpperConfidenceInterval = 6,
            AgeBand = new Age
            {
                Value = "0-4",
                IsAggregate = true
            },
            Deprivation = new Deprivation
            {
                Value = "Most deprived",
                Type = "Decile",
                Sequence = 1,
                IsAggregate = true
            },
            Sex = new Sex
            {
                Value = "Male",
                IsAggregate = false,
            },
            Trend = "Trend",
            IsAggregate = false,
        };

        var actual = Mappings.HealthDataMapper.Map(denormalisedHealthMeasure);

        actual.ShouldBeEquivalentTo(expectedHealthData);
    }
}
