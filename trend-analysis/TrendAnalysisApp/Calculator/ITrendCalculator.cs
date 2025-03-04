using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Calculator;

public interface ITrendCalculator
{
    public Trend CalculateTrend(
        IndicatorDimensionModel indicator,
        IEnumerable<HealthMeasureModel> healthMeasures
    );
}
