using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public class HealthMeasureModelHelper
{
    private static readonly AreaDimensionModelHelper AreaDimensionModelHelper = new();

    private HealthMeasureModel _healthMeasure = new HealthMeasureModel
    {
        HealthMeasureKey = 1,
        Count = 1.0,
        Value = 1.0,
        LowerCI = 1.0,
        UpperCI = 1.0,
        Year = 2025,
        AreaKey = 1,
        AgeKey = 1,
        IndicatorKey = 1,
        SexKey = 1,
        AreaDimension = AreaDimensionModelHelper.Build(),
        AgeDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            Name = "Name",
            AgeID = 1
        },
        IndicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            Name = "Name",
            IndicatorId = 0,
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(1),
        },
        SexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Name",
            IsFemale = true,
            HasValue = true,
            SexId = 1,
        }
    };

    public HealthMeasureModelHelper WithAreaDimension(AreaDimensionModel areaDimension)
    {
        _healthMeasure.AreaDimension = areaDimension;
        return this;
    }

    public HealthMeasureModelHelper WithYear(short year)
    {
        _healthMeasure.Year = year;
        return this;
    }

    public HealthMeasureModel Build()
    {
        return _healthMeasure;
    }
}