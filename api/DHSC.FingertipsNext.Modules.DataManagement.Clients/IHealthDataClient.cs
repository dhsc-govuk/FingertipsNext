namespace DHSC.FingertipsNext.Modules.DataManagement.Clients;

public interface IHealthDataClient
{
    Task DeleteHealthDataAsync(string batchId);
}