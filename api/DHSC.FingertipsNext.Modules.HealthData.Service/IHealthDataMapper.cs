using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IHealthDataMapper
{
    IndicatorPolarity MapIndicatorPolarity(string? source);
    BenchmarkComparisonMethod MapBenchmarkComparisonMethod(string? source);
    HealthDataPoint Map(HealthMeasureModel source);
    IList<HealthDataPoint> Map(IList<HealthMeasureModel> source);
    IList<IndicatorQuartileData> Map(IList<QuartileDataModel> source);
}
