using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Clients;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.DataManagement.UnitTests.TestData;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services;

public class DataManagementServiceTests
{
    private const string ContainerName = "TestContainer";
    private const int StubIndicatorId = 1;
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();
    private readonly BlobServiceClient _blobServiceClient = Substitute.For<BlobServiceClient>();
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly IHealthDataClient _healthDataClient = Substitute.For<IHealthDataClient>();
    private readonly ILogger<DataManagementService> _logger = Substitute.For<ILogger<DataManagementService>>();
    private readonly IDataManagementMapper _mapper = Substitute.For<IDataManagementMapper>();
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
            _mapper, _healthDataClient);

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
        var expectedBatch = BatchExamples.Batch with
        {
            IndicatorId = StubIndicatorId,
            CreatedAt = DateTime.UtcNow,
            Status = BatchStatus.Received,
            OriginalFileName = "ValidHeadersAndValidDataRows.csv",
            PublishedAt = publishedAt,
            UserId = Guid.Empty.ToString()
        };
        _mapper.Map(Arg.Any<BatchModel>()).Returns(expectedBatch);

        // Act
        await using (var stream = File.Open(path, FileMode.Open))
        {
            result = await _service.UploadFileAsync(stream, StubIndicatorId, publishedAt,
                "ValidHeadersAndValidDataRows.csv", Guid.Empty);
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

        var logCalls = _logger.ReceivedCalls().ToList();
        logCalls.Count.ShouldBe(2);
        logCalls[0].GetArguments()[0].ShouldBe(LogLevel.Debug);
        logCalls[1].GetArguments()[0].ShouldBe(LogLevel.Information);
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
            .Do(_ => throw new RequestFailedException("failed"));
        var publishedAt = new DateTime(2025, 1, 1, 0, 0, 0);

        // Act
        var result =
            await _service.UploadFileAsync(Stream.Null, StubIndicatorId, publishedAt, "upload.csv", Guid.Empty);

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
            _repository, _mapper, _healthDataClient));
    }

    [Fact]
    public async Task ListBatchesShouldReturnBatches()
    {
        // Arrange
        var indicatorIds = new[] { 1234, 5678 };

        var batchesInDb = new[]
        {
            BatchExamples.BatchModel with
            {
                IndicatorId = 1234,
                Status = BatchStatus.Received
            },
            BatchExamples.BatchModel with
            {
                IndicatorId = 5678,
                Status = BatchStatus.Deleted
            }
        };

        var expectedBatches = new[]
        {
            BatchExamples.Batch with
            {
                IndicatorId = 1234,
                Status = BatchStatus.Received
            },
            BatchExamples.Batch with
            {
                IndicatorId = 5678,
                Status = BatchStatus.Deleted
            }
        };
        _repository.GetBatchesByIdsAsync(indicatorIds).Returns(batchesInDb);
        _mapper.Map(Arg.Any<BatchModel>()).Returns(x => expectedBatches[0], x => expectedBatches[1]);

        // Act
        var batches = await _service.ListBatches(indicatorIds);

        // Assert
        var batchList = batches.ToList();
        batchList.Count.ShouldBe(2);
        batchList.ShouldContain(expectedBatches[0]);
        batchList.ShouldContain(expectedBatches[1]);
    }

    [Fact]
    public async Task ListBatchesShouldReturnAllBatchesIfNoIndicatorsSpecified()
    {
        // Arrange
        var batchesInDb = new[]
        {
            BatchExamples.BatchModel with
            {
                IndicatorId = 1234,
                Status = BatchStatus.Received
            },
            BatchExamples.BatchModel with
            {
                IndicatorId = 5678,
                Status = BatchStatus.Deleted
            }
        };

        var expectedBatches = new[]
        {
            BatchExamples.Batch with
            {
                IndicatorId = 1234,
                Status = BatchStatus.Received
            },
            BatchExamples.Batch with
            {
                IndicatorId = 5678,
                Status = BatchStatus.Deleted
            }
        };
        _repository.GetAllBatchesAsync().Returns(batchesInDb);

        _mapper.Map(Arg.Any<BatchModel>()).Returns(x => expectedBatches[0], x => expectedBatches[1]);

        // Act
        var batches = await _service.ListBatches([]);

        // Assert
        var batchList = batches.ToList();
        batchList.Count.ShouldBe(2);
        batchList.ShouldContain(expectedBatches[0]);
        batchList.ShouldContain(expectedBatches[1]);
    }

    [Fact]
    public async Task ListBatchesShouldThrowAnExceptionIfANullListOfIndicatorsIsSpecified()
    {
        await _service.ListBatches(null!).ShouldThrowAsync(typeof(ArgumentNullException));
    }

    [Fact]
    public async Task DeleteBatchShouldReturnOk()
    {
        // Arrange
        var model = new BatchModel
        {
            BatchKey = 0,
            BatchId = "123",
            IndicatorId = 0,
            OriginalFileName = "upload.csv",
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0),
            PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0).AddYears(1),
            DeletedAt = DateTime.UtcNow,
            DeletedUserId = Guid.Empty,
            UserId = Guid.Empty,
            Status = BatchStatus.Deleted
        };

        var expected = new Batch
        {
            BatchId = model.BatchId,
            IndicatorId = model.IndicatorId,
            OriginalFileName = model.OriginalFileName,
            CreatedAt = model.CreatedAt,
            PublishedAt = model.PublishedAt,
            DeletedAt = model.DeletedAt,
            UserId = model.UserId.ToString(),
            DeletedUserId = model.DeletedUserId.ToString(),
            Status = model.Status
        };

        _repository.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<IList<int>>()).Returns(model);
        _healthDataClient.DeleteHealthDataAsync(Arg.Any<string>()).Returns(true);
        _mapper.Map(Arg.Any<BatchModel>()).Returns(expected);

        // Act
        var result = await _service.DeleteBatchAsync("123", Guid.Empty, [model.IndicatorId]);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.Ok);

        result.Model.ShouldNotBeNull();
        result.Model.BatchId.ShouldBe("123");
        result.Model.ShouldBeEquivalentTo(expected);

        var logCalls = _logger.ReceivedCalls().ToList();
        logCalls.Count.ShouldBe(1);
        logCalls[0].GetArguments()[0].ShouldBe(LogLevel.Information);
    }

    [Theory]
    [InlineData("BatchNotFound", "Not found", OutcomeType.NotFound)]
    [InlineData("BatchPublished", "Batch already published", OutcomeType.ClientError)]
    [InlineData("BatchDeleted", "Batch already deleted", OutcomeType.ClientError)]
    [InlineData("PermissionDenied", "Permission denied when deleting batch", OutcomeType.PermissionDenied)]
    public async Task DeleteBatchShouldReturnError(string exceptionMessage, string expectedErrorMessage,
        OutcomeType expectedOutcome)
    {
        // Arrange
        _repository.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<IList<int>>())
            .Throws(new ArgumentException(exceptionMessage));

        // Act
        var result = await _service.DeleteBatchAsync("123", Guid.Empty, []);

        // Assert
        result.Outcome.ShouldBe(expectedOutcome);
        result.Errors.ShouldHaveSingleItem();
        result.Errors.FirstOrDefault().ShouldBe(expectedErrorMessage);
    }

    [Fact]
    public async Task DeleteBatchShouldReturnServerError()
    {
        // Arrange
        _repository.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<IList<int>>())
            .Throws(new ArgumentNullException());

        // Act
        var result = await _service.DeleteBatchAsync("123", Guid.Empty, []);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.ServerError);
    }

    [Fact]
    public async Task DeleteBatchShouldReturnServerErrorWhenDeletingHealthData()
    {
        // Arrange
        var model = new BatchModel
        {
            BatchKey = 0,
            BatchId = "123",
            IndicatorId = 0,
            OriginalFileName = "upload.csv",
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0),
            PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0).AddYears(1),
            DeletedAt = DateTime.UtcNow,
            DeletedUserId = Guid.Empty,
            UserId = Guid.Empty,
            Status = BatchStatus.Deleted
        };

        _repository.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>(), Arg.Any<IList<int>>()).Returns(model);
        _healthDataClient.DeleteHealthDataAsync(Arg.Any<string>()).Returns(false);

        // Act
        var result = await _service.DeleteBatchAsync("123", Guid.Empty, [123]);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.ServerError, "An unexpected error occurred");
    }
}