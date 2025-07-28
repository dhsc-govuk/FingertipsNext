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
    private const string UserId = "413e6b6f-a067-4971-bda5-7af790f34465";
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();
    private readonly BlobServiceClient _blobServiceClient = Substitute.For<BlobServiceClient>();
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly IHealthDataClient _healthDataClient = Substitute.For<IHealthDataClient>();
    private readonly ILogger<DataManagementService> _logger = Substitute.For<ILogger<DataManagementService>>();
    private readonly IDataManagementMapper _mapper = Substitute.For<IDataManagementMapper>();
    private readonly DateTime _mockDate;
    private readonly string _formattedMockDate;
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

        _mockDate = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        _formattedMockDate = _mockDate.ToString("yyyy-MM-ddTHH:mm:ss.fff");
        _timeProvider.GetUtcNow().Returns(_mockDate);
        _blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient($"{StubIndicatorId}_{_formattedMockDate}.csv")
            .Returns(_blobClient);
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        // Arrange
        const string validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndValidDataRows2.csv";
        var path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        UploadHealthDataResponse result;
        var publishedAt = new DateTime(2025, 1, 1, 0, 0, 0);
        const string expectedUserId = "user-id";
        const string expectedOriginalFilename = "ValidHeadersAndValidDataRows2.csv";
        var expectedBatch = BatchExamples.Batch;
        _mapper.Map(Arg.Any<BatchModel>()).Returns(expectedBatch);

        // Act
        await using (var stream = File.Open(path, FileMode.Open))
        {
            result = await _service.UploadFileAsync(stream, StubIndicatorId, expectedUserId, publishedAt,
                expectedOriginalFilename);
        }

        // Assert
        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>());
        result.Outcome.ShouldBe(OutcomeType.Ok);

        var parameter = _repository.ReceivedCalls().First().GetArguments().First() as BatchModel;
        parameter.BatchId.ShouldBe($"{StubIndicatorId}_{_formattedMockDate}");
        parameter.IndicatorId.ShouldBe(StubIndicatorId);
        parameter.OriginalFileName.ShouldBe(expectedOriginalFilename);
        parameter.CreatedAt.ShouldBe(_mockDate);
        parameter.DeletedAt.ShouldBeNull();
        parameter.PublishedAt.ShouldBe(publishedAt);
        parameter.UserId.ShouldBe(expectedUserId);
        parameter.DeletedUserId.ShouldBeNull();
        parameter.Status.ShouldBe(BatchStatus.Received);

        var model = result.Model;
        model.ShouldBe(expectedBatch);

        var logCalls = _logger.ReceivedCalls().ToList();
        logCalls.Count.ShouldBe(2);
        logCalls[0].GetArguments()[0].ShouldBe(LogLevel.Debug);
        logCalls[1].GetArguments()[0].ShouldBe(LogLevel.Information);
    }

    [Fact]
    public void ValidateCsvShouldFailWhenCsvIsInvalid()
    {
        // Act
        const string validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndNoDataRows.csv";
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
        const string validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndValidDataRows2.csv";
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
        var result = await _service.UploadFileAsync(Stream.Null, StubIndicatorId, "user-id", publishedAt, "upload.csv");

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
        _mapper.Map(Arg.Any<BatchModel>()).Returns(_ => expectedBatches[0], _ => expectedBatches[1]);

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

        _mapper.Map(Arg.Any<BatchModel>()).Returns(_ => expectedBatches[0], _ => expectedBatches[1]);

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
        var model = BatchExamples.BatchModel with
        {
            BatchKey = 0,
            BatchId = "123",
            IndicatorId = 0,
            OriginalFileName = "upload.csv",
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0),
            PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0).AddYears(1),
            UserId = UserId,
        };
        var expected = BatchExamples.Batch with
        {
            BatchId = model.BatchId,
            IndicatorId = model.IndicatorId,
            OriginalFileName = model.OriginalFileName,
            CreatedAt = model.CreatedAt,
            PublishedAt = model.PublishedAt,
            DeletedAt = model.DeletedAt,
            UserId = model.UserId,
            DeletedUserId = model.DeletedUserId,
            Status = model.Status
        };

        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);
        _repository.DeleteBatchAsync(Arg.Any<BatchModel>(), Arg.Any<string>()).Returns(model);
        _healthDataClient.DeleteHealthDataAsync(Arg.Any<string>()).Returns(Task.CompletedTask);
        _mapper.Map(Arg.Any<BatchModel>()).Returns(expected);

        // Act
        var result = await _service.DeleteBatchAsync("123", UserId, [model.IndicatorId]);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.Ok);

        result.Model.ShouldNotBeNull();
        result.Model.BatchId.ShouldBe(expected.BatchId);
        result.Model.ShouldBeEquivalentTo(expected);

        var logCalls = _logger.ReceivedCalls().ToList();
        logCalls.Count.ShouldBe(1);
        logCalls[0].GetArguments()[0].ShouldBe(LogLevel.Information);
    }

    [Fact]
    public async Task DeleteBatchShouldReturnBatchNotFoundError()
    {
        // Arrange
        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(Task.FromResult<BatchModel?>(null));

        // Act
        var result = await _service.DeleteBatchAsync("123", UserId, []);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.NotFound);
        result.Errors.ShouldHaveSingleItem();
        result.Errors.FirstOrDefault().ShouldBe("Not found");
    }

    [Fact]
    public async Task DeleteBatchShouldReturnBatchDeletedError()
    {
        // Arrange
        var model = BatchExamples.BatchModel with
        {
            DeletedAt = _timeProvider.GetUtcNow().UtcDateTime,
            Status = BatchStatus.Deleted
        };

        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);

        // Act
        var result = await _service.DeleteBatchAsync("123", UserId, []);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.ClientError);
        result.Errors.ShouldHaveSingleItem();
        result.Errors.FirstOrDefault().ShouldBe("Batch already deleted");
    }

    [Fact]
    public async Task DeleteBatchShouldReturnBatchPublishedError()
    {
        // Arrange
        var model = BatchExamples.BatchModel;

        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);

        // Act
        var result = await _service.DeleteBatchAsync("123", UserId, []);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.ClientError);
        result.Errors.ShouldHaveSingleItem();
        result.Errors.FirstOrDefault().ShouldBe("Batch already published");
    }

    [Fact]
    public async Task DeleteBatchShouldReturnServerError()
    {
        // Arrange
        var model = BatchExamples.BatchModel with
        {
            IndicatorId = 123,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);
        _repository.DeleteBatchAsync(Arg.Any<BatchModel>(), Arg.Any<string>())
            .Throws(new ArgumentNullException());

        // Act
        var result = await _service.DeleteBatchAsync("123", UserId, []);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.ServerError);
    }

    [Fact]
    public async Task DeleteBatchHealthDataClientShouldThrowException()
    {
        // Arrange
        var model = BatchExamples.BatchModel with
        {
            IndicatorId = 123,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expected = model with
        {
            DeletedAt = model.DeletedAt,
            DeletedUserId = model.DeletedUserId,
            Status = model.Status
        };
        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);
        _repository.DeleteBatchAsync(Arg.Any<BatchModel>(), Arg.Any<string>()).Returns(expected);
        _healthDataClient.DeleteHealthDataAsync(Arg.Any<string>()).ThrowsAsync(new InvalidCastException("Error"));

        // Act
        await Should.ThrowAsync<InvalidCastException>(async () =>
        {
            await _service.DeleteBatchAsync("123", UserId, []);
        });
    }

    [Theory]
    [InlineData(123)]
    [InlineData(321, 123)]
    public async Task EnsureBatchTheUserHasPermissionsForCanBeDeleted(params int[] indicatorIdsThatCanBeModified)
    {
        // Arrange
        var model = BatchExamples.BatchModel with
        {
            IndicatorId = 123,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expectedModel = model with
        {
            Status = BatchStatus.Deleted,
            DeletedAt = _timeProvider.GetUtcNow().Date,
            DeletedUserId = UserId
        };
        _repository.GetBatchByIdAsync(Arg.Any<string>()).Returns(model);
        _repository.DeleteBatchAsync(Arg.Any<BatchModel>(), Arg.Any<string>()).Returns(expectedModel);
        _healthDataClient.DeleteHealthDataAsync(Arg.Any<string>()).Returns(Task.CompletedTask);

        // Act
        var result = await _service.DeleteBatchAsync(model.BatchId, UserId, indicatorIdsThatCanBeModified);


        // Assert
        result.Outcome.ShouldBe(OutcomeType.Ok);
    }

    [Fact]
    public async Task EnsureAdminCanDeleteAnyBatch()
    {
        // Arrange
        // The administrator is represented by an empty list of permissions.
        var adminIndicatorsThatCanBeModified = Array.Empty<int>();

        var model123 = BatchExamples.BatchModel with
        {
            IndicatorId = 123,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expectedModel123 = model123 with
        {
            Status = BatchStatus.Deleted,
            DeletedAt = _timeProvider.GetUtcNow().Date,
            DeletedUserId = UserId
        };

        var model456 = BatchExamples.BatchModel with
        {
            IndicatorId = 456,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expectedModel456 = model456 with
        {
            Status = BatchStatus.Deleted,
            DeletedAt = _timeProvider.GetUtcNow().Date,
            DeletedUserId = UserId
        };

        var model789 = BatchExamples.BatchModel with
        {
            IndicatorId = 789,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expectedModel789 = model789 with
        {
            Status = BatchStatus.Deleted,
            DeletedAt = _timeProvider.GetUtcNow().Date,
            DeletedUserId = UserId
        };
        _repository.GetBatchByIdAsync(model123.BatchId).Returns(model123);
        _repository.GetBatchByIdAsync(model456.BatchId).Returns(model456);
        _repository.GetBatchByIdAsync(model789.BatchId).Returns(model789);
        _repository.DeleteBatchAsync(model123, Arg.Any<string>()).Returns(expectedModel123);
        _repository.DeleteBatchAsync(model456, Arg.Any<string>()).Returns(expectedModel456);
        _repository.DeleteBatchAsync(model789, Arg.Any<string>()).Returns(expectedModel789);


        // Act
        var result123 = await _service.DeleteBatchAsync(model123.BatchId, UserId, adminIndicatorsThatCanBeModified);

        // Assert
        result123.Outcome.ShouldBe(OutcomeType.Ok);

        // Act
        var result456 = await _service.DeleteBatchAsync(model456.BatchId, UserId, adminIndicatorsThatCanBeModified);

        // Assert
        result456.Outcome.ShouldBe(OutcomeType.Ok);

        // Act
        var result789 = await _service.DeleteBatchAsync(model789.BatchId, UserId, adminIndicatorsThatCanBeModified);

        // Assert
        result789.Outcome.ShouldBe(OutcomeType.Ok);
    }


    [Theory]
    [InlineData(383)]
    [InlineData(383, 94532)]
    public async Task EnsureBatchTheUserDoesNotHavePermissionsForIsNotDeleted(
        params int[] indicatorIdsThatCanBeModified)
    {
        // Arrange
        var model123 = BatchExamples.BatchModel with
        {
            IndicatorId = 123,
            Status = BatchStatus.Received,
            PublishedAt = _timeProvider.GetUtcNow().UtcDateTime.AddYears(1)
        };
        var expectedModel123 = model123 with
        {
            Status = BatchStatus.Deleted,
            DeletedAt = _timeProvider.GetUtcNow().Date,
            DeletedUserId = UserId
        };
        _repository.GetBatchByIdAsync(model123.BatchId).Returns(model123);
        _repository.DeleteBatchAsync(model123, Arg.Any<string>()).Returns(expectedModel123);

        // Act
        var result = await _service.DeleteBatchAsync(model123.BatchId, UserId, indicatorIdsThatCanBeModified);

        // Assert
        result.Outcome.ShouldBe(OutcomeType.PermissionDenied);
        result.Errors.Count.ShouldBe(1);
        result.Errors.First().ShouldBe("Permission denied when deleting batch");
    }

    [Fact]
    public async Task DeleteBatchAsyncShouldThrowAnExceptionIfANullBatchIdIsSpecified()
    {
        await _service.DeleteBatchAsync(null!, UserId, [])
            .ShouldThrowAsync(typeof(ArgumentNullException));
    }

    [Fact]
    public async Task DeleteBatchAsyncShouldThrowAnExceptionIfANullListOfIndicatorsIsSpecified()
    {
        await _service.DeleteBatchAsync("batch-id", UserId, null!)
            .ShouldThrowAsync(typeof(ArgumentNullException));
    }
}