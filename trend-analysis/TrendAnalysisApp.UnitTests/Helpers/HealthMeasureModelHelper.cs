using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.UnitTests.Helpers;

public class HealthMeasureModelHelper(
    int key = 1,
    short year = 2025,
    double? count = 1.0,
    double value = 1.0,
    double denominator = 1.0,
    double? lowerCi = 1.0,
    double? upperCi = 1.0
    
    )
{
    private IndicatorDimensionModel _indicatorDimension;
    
    public HealthMeasureModelHelper WithIndicatorDimension(IndicatorDimensionModel indicatorDimension)
    {
        _indicatorDimension = indicatorDimension;

        return this;
    }
    
    public HealthMeasureModelHelper WithIndicatorDimension(
        string name = "indicator name",
        int indicatorId = 1
    )
    {
        return WithIndicatorDimension(new IndicatorDimensionModel
        {
            IndicatorKey = (short)key,
            Name = name,
            IndicatorId = indicatorId
        });
    }
    
    // private IndicatorDimensionModel DefaultIndicatorDimension()
    // {
    //     return new IndicatorDimensionModel
    //     {
    //         IndicatorKey = (short)key,
    //         Name = "indicator name",
    //         IndicatorId = 1
    //     };
    // }
    
    private TrendDimensionModel DefaultTrendDimension()
    {
        return new TrendDimensionModel
        {
            TrendKey = (byte)key,
            Name = "Not yet calculated",
        };
    }
    
    public HealthMeasureModel Build()
    {
        var indicatorDimension = _indicatorDimension;//?? DefaultIndicatorDimension();
        var trendDimension = DefaultTrendDimension();

        return new HealthMeasureModel
        {
            HealthMeasureKey = key,
            Count = count,
            Value = value,
            Denominator = denominator,
            LowerCI = lowerCi,
            UpperCI = upperCi,
            Year = year,
            // AreaKey = areaDimension.AreaKey,
            // AgeKey = ageDimension.AgeKey,
            IndicatorKey = indicatorDimension.IndicatorKey,
            // SexKey = sexDimension.SexKey,
            TrendKey = trendDimension.TrendKey,
            // DeprivationKey = deprivationDimension.DeprivationKey,
            // AreaDimension = areaDimension,
            // AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            // SexDimension = sexDimension,
            TrendDimension = trendDimension,
            // DeprivationDimension = deprivationDimension,
            // IsAggregate = isAggregate
        };
    }
    
}