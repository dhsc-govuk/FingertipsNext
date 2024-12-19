using DHSC.FingertipsNext.Modules.Core.Repository;


namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public interface IHealthMeasureService
    {
        HealthMeasure GetFirstHealthMeasure();
    }
}
