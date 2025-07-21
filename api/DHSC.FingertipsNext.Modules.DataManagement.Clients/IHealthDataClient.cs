namespace DHSC.FingertipsNext.Modules.DataManagement.Clients;

public interface IHealthDataClient
{
    Task<bool> DeleteHealthDataAsync(string batchId);
}