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
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();

    private const string ContainerName = "TestContainer";
    private const string BlobName = "TestBlob";

    public DataManagementServiceTests()
    {
        var blobServiceClient = Substitute.For<BlobServiceClient>();
        _service = new DataManagementService(blobServiceClient);

        blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient(BlobName).Returns(_blobClient);
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        // Act
        var result = await _service.UploadFileAsync(Stream.Null, BlobName, ContainerName);

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.ShouldBe(true);
    }

    [Fact]
    public async Task UploadShouldFail()
    {
        // Arrange
        _blobClient
            .When(x => x.UploadAsync(Arg.Any<Stream>(), true))
            .Do(x => throw new RequestFailedException("failed"));

        // Act
        var result = await _service.UploadFileAsync(Stream.Null, BlobName, ContainerName);

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.ShouldBe(false);
    }
}