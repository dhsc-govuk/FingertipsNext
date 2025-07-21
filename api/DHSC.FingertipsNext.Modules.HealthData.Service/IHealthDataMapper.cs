using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IHealthDataMapper
{
    IndicatorPolarity MapIndicatorPolarity(string? source);
    CollectionFrequency MapCollectionFrequency(string? source);
    ReportingPeriod MapReportingPeriod(string? source) => throw new NotImplementedException();
    BenchmarkComparisonMethod MapBenchmarkComparisonMethod(string? source);
    HealthDataPoint Map(HealthMeasureModel source);
    Sex Map(SexDimensionModel source);
    IList<HealthDataPoint> Map(IList<HealthMeasureModel> source);
    IList<HealthDataPoint> Map(IList<DenormalisedHealthMeasureModel> source);
    IList<IndicatorQuartileData> Map(IList<QuartileDataModel> source);
}

