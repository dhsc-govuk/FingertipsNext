using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Mappings;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
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
    private readonly IDataManagementMapper _mapper = Substitute.For<DataManagementMapper>();
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
        _service = new DataManagementService(_blobServiceClient, _configuration, _logger, _timeProvider, _repository,
            _mapper);

        var mockDate = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        _timeProvider.GetUtcNow().Returns(mockDate);
        _blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient($"{StubIndicatorId}_{mockDate:yyyy-MM-ddTHH:mm:ss.fff}.csv")
            .Returns(_blobClient);
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        // Arrange
        var validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndValidDataRows.csv";
        var path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        UploadHealthDataResponse result;
        var publishedAt = new DateTime(2025, 1, 1, 0, 0, 0);

        // Act
        await using (var stream = File.Open(path, FileMode.Open))
        {
            result = await _service.UploadFileAsync(stream, StubIndicatorId, publishedAt,
                "ValidHeadersAndValidDataRows.csv");
        }

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>());
        result.Outcome.ShouldBe(OutcomeType.Ok);

        var parameter = _repository.ReceivedCalls().First().GetArguments().First() as BatchModel;
        parameter.IndicatorId.ShouldBe(StubIndicatorId);
        parameter.CreatedAt.Date.ShouldBe(DateTime.Today);
        parameter.PublishedAt.ShouldBe(publishedAt);

        var model = result.Model;
        model.IndicatorId.ShouldBe(StubIndicatorId);
        model.Status.ShouldBe(BatchStatus.Received);
        model.OriginalFileName.ShouldBe("ValidHeadersAndValidDataRows.csv");
        model.UserId.ShouldBe(Guid.Empty.ToString());
        model.PublishedAt.ShouldBe(publishedAt);
    }

    [Fact]
    public void ValidateCsvShouldFailWhenCsvIsInvalid()
    {
        // Act
        var validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndNoDataRows.csv";
        var path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        ICollection<string> result;

        // Act
        using (var stream = File.Open(path, FileMode.Open))
        {
            result = _service.ValidateCsv(stream);
        }

        // Assert
        result.ShouldHaveSingleItem();
        result.First().ShouldBe("No records found");
    }

    [Fact]
    public void ValidateCsvShouldSucceedWhenCsvIsValid()
    {
        // Act
        var validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndValidDataRows.csv";
        var path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        ICollection<string> result;

        // Act
        using (var stream = File.Open(path, FileMode.Open))
        {
            result = _service.ValidateCsv(stream);
        }

        // Assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task UploadShouldFailWhenExceptionIsThrown()
    {
        // Arrange
        _blobClient
            .When(x => x.UploadAsync(Arg.Any<Stream>()))
            .Do(x => throw new RequestFailedException("failed"));
        var publishedAt = new DateTime(2025, 1, 1, 0, 0, 0);

        // Act
        var result = await _service.UploadFileAsync(Stream.Null, StubIndicatorId, publishedAt, "upload.csv");

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>());
        result.Outcome.ShouldBe(OutcomeType.ServerError);
        result.Errors!.First().ShouldBe("An unexpected error occurred");
    }

    [Fact]
    public void DataManagementServiceInitialisationShouldFailWhenConfigVariableIsNullOrEmpty()
    {
        // Arrange
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { { "UPLOAD_STORAGE_CONTAINER_NAME", "" } })
            .Build();

        // Act/Assert
        Should.Throw<ArgumentException>(() => _service = new DataManagementService(_blobServiceClient, _configuration,
            _logger, _timeProvider,
            _repository, _mapper));
    }

    [Fact]
    public async Task ListBatchesShouldReturnBatches()
    {
        // Arrange
        var indicatorIds = new[] { 1234, 5678 };

        const string batchId = "batch_id";
        const string originalFileName = "upload.csv";
        var createdAt = new DateTime(2017, 6, 30);
        var publishedAt = new DateTime(2020, 3, 7);
        var userId = Guid.NewGuid();

        var batchesInDb = new[]
        {
            new BatchModel
            {
                BatchId = batchId, IndicatorId = 1234, OriginalFileName = originalFileName,
                CreatedAt = createdAt, PublishedAt = publishedAt, UserId = userId, Status = BatchStatus.Received
            },
            new BatchModel
            {
                BatchId = batchId, IndicatorId = 5678, OriginalFileName = originalFileName,
                CreatedAt = createdAt, PublishedAt = publishedAt, UserId = userId, Status = BatchStatus.Deleted
            }
        };
        _repository.GetBatchesAsync(indicatorIds).Returns(batchesInDb);

        // Act
        var batches = await _service.ListBatches(indicatorIds);

        // Assert
        var batchList = batches.ToList();
        batchList.Count.ShouldBe(2);
        batchList.ShouldContain(new Batch
        {
            BatchId = batchId, IndicatorId = 1234, OriginalFileName = originalFileName, CreatedAt = createdAt,
            PublishedAt = publishedAt, UserId = userId.ToString(), Status = BatchStatus.Received
        });
        batchList.ShouldContain(new Batch
        {
            BatchId = batchId, IndicatorId = 5678, OriginalFileName = originalFileName, CreatedAt = createdAt,
            PublishedAt = publishedAt, UserId = userId.ToString(), Status = BatchStatus.Deleted
        });
    }
}