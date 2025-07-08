using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services;

public class DataManagementServiceTests
{
    private const string ContainerName = "TestContainer";
    private const int StubIndicatorId = 1;
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();
    private readonly BlobServiceClient _blobServiceClient = Substitute.For<BlobServiceClient>();
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly ILogger<DataManagementService> _logger = Substitute.For<ILogger<DataManagementService>>();
    private readonly IDataManagementRepository _repository = Substitute.For<IDataManagementRepository>();
    private readonly TimeProvider _timeProvider = Substitute.For<TimeProvider>();
    private IConfiguration _configuration;
    private DataManagementService _service;

    public DataManagementServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "UPLOAD_STORAGE_CONTAINER_NAME", ContainerName }
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        _service = new DataManagementService(_blobServiceClient, _configuration, _logger, _timeProvider, _repository);

        var mockDate = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        _timeProvider.GetUtcNow().Returns(mockDate);
        _blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient($"{StubIndicatorId}_{mockDate:yyyy-MM-ddTHH:mm:ss.fff}.csv")
            .Returns(_blobClient);
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        // Act
        var result = await _service.UploadFileAsync(Stream.Null, StubIndicatorId);

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>());
        result.ShouldBe(true);
    }

    [Fact]
    public async Task UploadShouldFailWhenExceptionIsThrown()
    {
        // Arrange
        _blobClient
            .When(x => x.UploadAsync(Arg.Any<Stream>()))
            .Do(x => throw new RequestFailedException("failed"));

        // Act
        var result = await _service.UploadFileAsync(Stream.Null, StubIndicatorId);

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>());
        result.ShouldBe(false);
    }

    [Fact]
    public async Task UploadShouldFailWhenConfigVariableIsNullOrEmpty()
    {
        // Arrange
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { { "UPLOAD_STORAGE_CONTAINER_NAME", "" } })
            .Build();

        _service = new DataManagementService(_blobServiceClient, _configuration, _logger, _timeProvider, _repository);

        // Act
        var result = await _service.UploadFileAsync(Stream.Null, StubIndicatorId);

        // Assert
        await _blobClient.Received(0).UploadAsync(Arg.Any<Stream>());
        result.ShouldBe(false);
    }
}