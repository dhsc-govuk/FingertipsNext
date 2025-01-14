using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

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
}
