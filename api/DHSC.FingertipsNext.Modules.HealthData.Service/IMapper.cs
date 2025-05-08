using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IMapper
{
    IndicatorPolarity MapIndicatorPolarity(string source);
    BenchmarkComparisonMethod MapBenchmarkComparisonMethod(string source);
    HealthDataPoint Map(HealthMeasureModel source);
    List<HealthDataPoint> Map(IList<HealthMeasureModel> source);
    List<IndicatorQuartileData> Map(IList<QuartileDataModel> source);
}