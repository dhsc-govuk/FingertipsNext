using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services;

public class DataManagementServiceTests
{
    private readonly DataManagementService _service;
    private readonly IDataManagementRepository _repository;
    
    public DataManagementServiceTests()
    {
        _repository = new DataManagementRepository();
        _service = new DataManagementService(_repository);
    }

    [Fact]
    public void SayHelloToRepositoryTest()
    {
        // assert
        _service.SayHelloToRepository().ShouldBe("The Repository says: I'm a Repository");
    }
}