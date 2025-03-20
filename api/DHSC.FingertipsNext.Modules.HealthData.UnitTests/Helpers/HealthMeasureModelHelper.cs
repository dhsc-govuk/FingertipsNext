using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public class HealthMeasureModelHelper(
    int key = 1,
    short year = 2025,
    bool isAggregate = true,
    double? count = 1.0,
    double? value = 1.0,
    double? lowerCi = 1.0,
    double? upperCi = 1.0
)
{
    private AreaDimensionModel _areaDimension;
    private AgeDimensionModel _ageDimension;
    private IndicatorDimensionModel _indicatorDimension;
    private SexDimensionModel _sexDimension;
    private DeprivationDimensionModel _deprivationDimension;

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

    public HealthMeasureModelHelper WithAgeDimension(AgeDimensionModel ageDimension)
    {
        _ageDimension = ageDimension;

        return this;
    }

    public HealthMeasureModelHelper WithAgeDimension(
        short? ageKey = null,
        string name = "age name",
        short ageId = 0,
        bool hasValue = false
    )
    {
        return WithAgeDimension(new AgeDimensionModel
        {
            AgeKey = ageKey ?? (short) key,
            Name = name,
            AgeID = ageId,
            HasValue = hasValue
        });
    }

    private AgeDimensionModel DefaultAgeDimension()
    {
        return new AgeDimensionModel
        {
            AgeKey = (short)key,
            Name = "All ages",
            AgeID = 0,
            HasValue = false
        };
    }


    public HealthMeasureModelHelper WithIndicatorDimension(IndicatorDimensionModel indicatorDimension)
    {
        _indicatorDimension = indicatorDimension;
        
        return this;
    }
    
    public HealthMeasureModelHelper WithIndicatorDimension(
        string name = "indicator name",
        short indicatorId = 1,
        DateTime? startDate = null,
        DateTime? endDate = null
    )
    {
        return WithIndicatorDimension(new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = name,
            IndicatorId = indicatorId,
            StartDate = startDate ?? DateTime.Today,
            EndDate = endDate ?? DateTime.Today.AddDays(1),
        });
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

    public HealthMeasureModelHelper WithSexDimension(SexDimensionModel sexDimension)
    {
        _sexDimension = sexDimension;
        
        return this;
    }

    public HealthMeasureModelHelper WithSexDimension(
        byte? sexKey = null,
        string name = "sex name",
        bool hasValue = false,
        byte sexId = 0)
    {
        return WithSexDimension(new SexDimensionModel
        {
            SexKey = sexKey ?? (byte) key,
            Name = name,
            HasValue = hasValue,
            SexId = sexId
        });
    }

    private SexDimensionModel DefaultSexDimension()
    {
        return new SexDimensionModel
        {
            SexKey = (byte)key,
            Name = "Persons",
            HasValue = false,
            SexId = 0
        };
    }

    private TrendDimensionModel DefaultTrendDimension()
    {
        return new TrendDimensionModel
        {
            TrendKey = (byte)key,
            Name = "Not yet calculated",
            HasValue = false
        };
    }

    public HealthMeasureModelHelper WithDeprivationDimension(DeprivationDimensionModel deprivationDimension)
    {
        _deprivationDimension = deprivationDimension;
        
        return this;
    }

    public HealthMeasureModelHelper WithDeprivationDimension(
        string name = "All",
        string type = "All",
        byte sequence = 1,
        bool hasValue = false)
    {
        _deprivationDimension = new DeprivationDimensionModel
        {
            DeprivationKey = (byte)key,
            Name = name,
            Type = type,
            Sequence = sequence,
            HasValue = hasValue
        };

        return this;
    }

    private DeprivationDimensionModel DefaultDeprivationDimension()
    {
        return new DeprivationDimensionModel()
        {
            DeprivationKey = (short)key,
            Name = "All",
            Type = "All",
            Sequence = 1,
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
        var deprivationDimension = _deprivationDimension ?? DefaultDeprivationDimension();

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
            DeprivationKey = deprivationDimension.DeprivationKey,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension,
            TrendDimension = trendDimension,
            DeprivationDimension = deprivationDimension
        };
    }
}
