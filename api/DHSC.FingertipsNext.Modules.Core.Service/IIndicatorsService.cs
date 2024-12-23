using DHSC.FingertipsNext.Modules.Core.Schema;


namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public interface IIndicatorsService
    {
        IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string []areaCodes, short[]years);
    }
}
