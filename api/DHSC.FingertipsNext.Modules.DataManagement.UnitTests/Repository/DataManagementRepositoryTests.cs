using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTestsOLD.Repository;

public class DataManagementRepositoryTests
{
    private readonly DataManagementRepository _repository;

    public DataManagementRepositoryTests()
    {
        _repository = new DataManagementRepository();
    }
    [Fact]
    public void SayHelloTest()
    {
        // assert
        _repository.SayHello().ShouldBe("I'm a Repository");
    }
}