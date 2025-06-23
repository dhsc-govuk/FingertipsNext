using Azure;
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
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();

    private const string ContainerName = "TestContainer";
    private const string BlobName = "TestBlob";

    public DataManagementServiceTests()
    {
        _repository = new DataManagementRepository();
        var blobServiceClient = Substitute.For<BlobServiceClient>();
        _service = new DataManagementService(_repository, blobServiceClient);

        blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient(BlobName).Returns(_blobClient);
    }

    [Fact]
    public void SayHelloToRepositoryTest()
    {
        // assert
        _service.SayHelloToRepository().ShouldBe("The Repository says: I'm a Repository");
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        var result = await _service.UploadFileAsync(Stream.Null, BlobName, ContainerName);

        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.ShouldBe(true);
    }

    [Fact]
    public async Task UploadShouldFail()
    {
        _blobClient
            .When(x => x.UploadAsync(Arg.Any<Stream>(), true))
            .Do(x => throw new RequestFailedException("failed"));

        var result = await _service.UploadFileAsync(Stream.Null, BlobName, ContainerName);

        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.ShouldBe(false);
    }
}