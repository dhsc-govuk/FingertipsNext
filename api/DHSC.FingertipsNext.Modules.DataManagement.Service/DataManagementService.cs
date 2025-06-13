using DHSC.FingertipsNext.Modules.DataManagement.Repository;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService(IDataManagementRepository dataManagementRepository) : IDataManagementService
{
    public string SayHelloToRepository()
    {
        var repositorySays = dataManagementRepository.SayHello();
        return "The Repository says: " + repositorySays;
    }
}