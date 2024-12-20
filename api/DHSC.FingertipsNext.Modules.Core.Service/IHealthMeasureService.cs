using DHSC.FingertipsNext.Modules.Core.Schema;


namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public interface IHealthMeasureService
    {
        HealthMeasure? GetFirstHealthMeasure();
    }
}
