using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services;

public class DataManagementServiceTests
{
    private readonly DataManagementService _service;
    private readonly IDataManagementRepository _repository;
    private readonly BlobServiceClient _blobServiceClient;

    public DataManagementServiceTests()
    {
        _repository = new DataManagementRepository();
        _blobServiceClient = Substitute.For<BlobServiceClient>();
        _service = new DataManagementService(_repository, _blobServiceClient);
    }

    [Fact]
    public void SayHelloToRepositoryTest()
    {
        // assert
        _service.SayHelloToRepository().ShouldBe("The Repository says: I'm a Repository");
    }
}