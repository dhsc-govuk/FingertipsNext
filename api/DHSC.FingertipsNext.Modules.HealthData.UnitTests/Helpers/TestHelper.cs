using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public static class TestHelper
{
    public static HealthMeasureModel BuildHealthMeasureModel(string areaCode, short year, DateTime date, int id = 1, int? indicatorId = null)
    {
        var areaDimension = new AreaDimensionModel
        {
            AreaKey = id,
            Code = areaCode,
            Name = "Name",
            StartDate = date,
            EndDate = date.AddDays(1),
        };
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = (short)id,
            Name = "Name",
            IndicatorId = indicatorId ?? id,
            StartDate = date,
            EndDate = date.AddDays(1),
        };
        var sexDimension = new SexDimensionModel
        {
            SexKey = (byte)id,
            Name = "Name",
            IsFemale = true,
            HasValue = true,
            SexId = 1,
        };
        var ageDimension = new AgeDimensionModel
        {
            AgeKey = (short)id,
            AgeID = 1,
            Name = "Name"
        };

        return new HealthMeasureModel
        {
            HealthMeasureKey = id,
            Count = 1.0,
            Value = 1.0,
            LowerCI = 1.0,
            UpperCI = 1.0,
            Year = year,
            AreaKey = id,
            AgeKey = (short)id,
            IndicatorKey = (short)id,
            SexKey = (byte)id,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension
        };
    }

    /// <summary>
    /// build a HealtDataPoint 
    /// </summary>
    /// <param name="year"></param>
    /// <param name="count"></param>
    /// <param name="value"></param>
    /// <param name="lowerConfidenceInterval"></param>
    /// <param name="upperConfidenceInterval"></param>
    /// <param name="ageBand"></param>
    /// <param name="sex"></param>
    /// <returns></returns>
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
