using DHSC.FingertipsNext.Modules.HealthData.Service;

namespace DHSC.FingertipsNext.Modules.DataManagement.Clients;

public class HealthDataClient(IIndicatorsService service) : IHealthDataClient
{
    private IIndicatorsService Service { get; } = service;

    public async Task DeleteHealthDataAsync(string batchId)
    {
        await Service.DeleteUnpublishedDataAsync(batchId);
    }
}