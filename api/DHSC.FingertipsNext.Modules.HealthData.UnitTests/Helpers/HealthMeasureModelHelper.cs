using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

internal sealed class HealthMeasureModelHelper(
    int key = 1,
    short year = 2025,
    double? count = 1.0,
    double? value = 1.0,
    double? lowerCi = 1.0,
    double? upperCi = 1.0,
    bool isPublished = true
)
{
    private AreaDimensionModel? _areaDimension;
    private AgeDimensionModel? _ageDimension;
    private IndicatorDimensionModel? _indicatorDimension;
    private SexDimensionModel? _sexDimension;
    private DeprivationDimensionModel? _deprivationDimension;
    private TrendDimensionModel? _trendDimension;
    private string? _batchId;
    private DateDimensionModel _fromDateDimension = new DateDimensionModel { DateKey = key, Date = new DateTime(year, 01, 01) };
    private DateDimensionModel _toDateDimension = new DateDimensionModel { DateKey = key, Date = new DateTime(year, 12, 31) };
    private PeriodDimensionModel _periodDimension = new PeriodDimensionModel { PeriodKey = (byte)key, Period = "yearly" };

    public HealthMeasureModelHelper WithAreaDimension(
        string code = "AreaCode",
        string name = "area name"
    )
    {
        _areaDimension = new AreaDimensionModel
        {
            AreaKey = key,
            Code = code,
            Name = name
        };
        return this;
    }

    private AreaDimensionModel DefaultAreaDimension()
    {
        return new AreaDimensionModel
        {
            AreaKey = key,
            Code = "AreaCode",
            Name = "area name"
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
        bool hasValue = false,
        bool ageIsAggregate = true
    )
    {
        return WithAgeDimension(new AgeDimensionModel
        {
            AgeKey = ageKey ?? (short)key,
            Name = name,
            AgeID = ageId,
            HasValue = hasValue,
            IsAggregate = ageIsAggregate
        });
    }

    private AgeDimensionModel DefaultAgeDimension()
    {
        return new AgeDimensionModel
        {
            AgeKey = (short)key,
            Name = "All ages",
            AgeID = 0,
            HasValue = false,
            IsAggregate = true
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
        string periodType = "Calendar"
    )
    {
        return WithIndicatorDimension(new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = name,
            IndicatorId = indicatorId,
            PeriodType = periodType
        });
    }

    private IndicatorDimensionModel DefaultIndicatorDimension()
    {
        return new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = "indicator name",
            IndicatorId = 1,
            PeriodType = "Calendar"
        };
    }

    public HealthMeasureModelHelper WithSexDimension(SexDimensionModel sexDimension)
    {
        _sexDimension = sexDimension;

        return this;
    }

    public HealthMeasureModelHelper WithSexDimension(
        byte? sexKey = null,
        string name = "Persons",
        bool hasValue = false,
        bool sexIsAggregate = true)
    {
        return WithSexDimension(new SexDimensionModel
        {
            SexKey = sexKey ?? (byte)key,
            Name = name,
            HasValue = hasValue,
            IsAggregate = sexIsAggregate
        });
    }

    private SexDimensionModel DefaultSexDimension()
    {
        return new SexDimensionModel
        {
            SexKey = (byte)key,
            Name = "Persons",
            HasValue = false,
            IsAggregate = true
        };
    }

    public HealthMeasureModelHelper WithTrendDimension(
        byte trendId = 1
    )
    {
        _trendDimension = DefaultTrendDimension();
        _trendDimension.TrendKey = trendId;
        return this;
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
        string type = "Deprivation Deciles",
        byte sequence = 1,
        bool hasValue = false,
        bool deprivationIsAggregate = true)
    {
        _deprivationDimension = new DeprivationDimensionModel
        {
            DeprivationKey = (byte)key,
            Name = name,
            Type = type,
            Sequence = sequence,
            HasValue = hasValue,
            IsAggregate = deprivationIsAggregate
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
            HasValue = false,
            IsAggregate = true
        };
    }

    private HealthMeasureModelHelper DefaultFromDateDimension(int year, int month, int day)
    {
        _fromDateDimension = new DateDimensionModel()
        { DateKey = key, Date = new DateTime(year, month, day) };
        return this;
    }

    private HealthMeasureModelHelper DefaultToDateDimension(int year, int month, int day)
    {
        _toDateDimension = new DateDimensionModel()
        { DateKey = key + 1, Date = new DateTime(year, month, day) };
        return this;
    }

    private HealthMeasureModelHelper DefaultPeriodDimension(string period)
    {
        _periodDimension = new PeriodDimensionModel()
        {
            PeriodKey = (byte)key,
            Period = period
        };
        return this;
    }

    public HealthMeasureModelHelper WithBatchId(string batchId)
    {
        _batchId = batchId;
        return this;
    }

    public HealthMeasureModel Build()
    {
        var areaDimension = _areaDimension ?? DefaultAreaDimension();
        var ageDimension = _ageDimension ?? DefaultAgeDimension();
        var indicatorDimension = _indicatorDimension ?? DefaultIndicatorDimension();
        var sexDimension = _sexDimension ?? DefaultSexDimension();
        var trendDimension = _trendDimension ?? DefaultTrendDimension();
        var deprivationDimension = _deprivationDimension ?? DefaultDeprivationDimension();
        var publishedAt = isPublished ? DateTime.UtcNow : DateTime.UtcNow.AddYears(1);
        var batchId = _batchId ?? "12345_20250101120000";


        return new HealthMeasureModel
        {
            HealthMeasureKey = key,
            Count = count,
            Value = value,
            LowerCi = lowerCi,
            UpperCi = upperCi,
            FromDateDimension = _fromDateDimension,
            ToDateDimension = _toDateDimension,
            PeriodDimension = _periodDimension,
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
            DeprivationDimension = deprivationDimension,
            IsAgeAggregatedOrSingle = ageDimension.IsAggregate,
            IsSexAggregatedOrSingle = sexDimension.IsAggregate,
            IsDeprivationAggregatedOrSingle = deprivationDimension.IsAggregate,
            PublishedAt = publishedAt,
            BatchId = batchId
        };
    }
}
