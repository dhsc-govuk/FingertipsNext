using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public class HealthMeasureModelHelper(
    int key = 1,
    double? count = 1.0,
    double? value = 1.0,
    double? lowerCi = 1.0,
    double? upperCi = 1.0,
    short year = 2025
    )
{
    private AreaDimensionModel? _areaDimension;
    private AgeDimensionModel? _ageDimension;
    private IndicatorDimensionModel? _indicatorDimension;
    private SexDimensionModel? _sexDimension;

    public HealthMeasureModelHelper WithAreaDimension(
        string code = "AreaCode",
        string name = "area name",
        DateTime? startDate = null,
        DateTime? endDate = null
        )
    {
        _areaDimension = new AreaDimensionModel
        {
            AreaKey = key,
            Code = code,
            Name = name,
            StartDate = startDate ?? DateTime.Today,
            EndDate = endDate ?? DateTime.Today.AddDays(1),
        };
        return this;
    }

    private AreaDimensionModel DefaultAreaDimension()
    {
        return new AreaDimensionModel
        {
            AreaKey = key,
            Code = "AreaCode",
            Name = "area name",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(1),
        };
    }

    public HealthMeasureModelHelper WithAgeDimension(
        string name = "age name",
        short ageId = 0,
        bool hasValue = false
        )
    {
        _ageDimension = new AgeDimensionModel
        {
            AgeKey = (short)key,
            Name = name,
            AgeID = ageId,
            HasValue = hasValue
        };

        return this;
    }

    private AgeDimensionModel DefaultAgeDimension()
    {
        return new AgeDimensionModel
        {
            AgeKey = (short)key,
            Name = "age name",
            AgeID = 0,
            HasValue = false
        };
    }

    public HealthMeasureModelHelper WithIndicatorDimension(
        string name = "indicator name",
        short indicatorId = 1,
        DateTime? startDate = null,
        DateTime? endDate = null
        )
    {
        _indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = name,
            IndicatorId = indicatorId,
            StartDate = startDate ?? DateTime.Today,
            EndDate = endDate ?? DateTime.Today.AddDays(1),
        };
        return this;
    }

    private IndicatorDimensionModel DefaultIndicatorDimension()
    {
        return new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = "indicator name",
            IndicatorId = 1,
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(1),
        };
    }

    public HealthMeasureModelHelper WithSexDimension(
        string name = "sex name",
        bool hasValue = false,
        byte sexId = 0)
    {
        _sexDimension = new SexDimensionModel
        {
            SexKey = (byte)key,
            Name = name,
            HasValue = hasValue,
            SexId = sexId
        };

        return this;
    }

    private SexDimensionModel DefaultSexDimension()
    {
        return new SexDimensionModel
        {
            SexKey = (byte)key,
            Name = "sex name",
            HasValue = false,
            SexId = 0
        };
    }

    private TrendDimensionModel DefaultTrendDimension()
    {
        return new TrendDimensionModel
        {
            TrendKey = (byte)key,
            Name = "NotYetCalculated",
            HasValue = false
        };
    }

    public HealthMeasureModel Build()
    {
        var areaDimension = _areaDimension ?? DefaultAreaDimension();
        var ageDimension = _ageDimension ?? DefaultAgeDimension();
        var indicatorDimension = _indicatorDimension ?? DefaultIndicatorDimension();
        var sexDimension = _sexDimension ?? DefaultSexDimension();
        var trendDimension = DefaultTrendDimension();

        return new HealthMeasureModel
        {
            HealthMeasureKey = key,
            Count = count,
            Value = value,
            LowerCi = lowerCi,
            UpperCi = upperCi,
            Year = year,
            AreaKey = areaDimension.AreaKey,
            AgeKey = ageDimension.AgeKey,
            IndicatorKey = indicatorDimension.IndicatorKey,
            SexKey = sexDimension.SexKey,
            TrendKey = trendDimension.TrendKey,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension,
            TrendDimension = trendDimension
        };
    }
}
