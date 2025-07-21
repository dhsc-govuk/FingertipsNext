using DHSC.FingertipsNext.Modules.HealthData.Service;

namespace DHSC.FingertipsNext.Modules.DataManagement.Clients;

public class HealthDataClient(IIndicatorsService service) : IHealthDataClient
{
    private IIndicatorsService Service { get; } = service;

    public async Task<bool> DeleteHealthDataAsync(string batchId)
    {
        var response = await Service.DeleteUnpublishedDataAsync(batchId);
        return response.Status == ResponseStatus.Success;
    }
}