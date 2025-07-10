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
    private DataManagementService _service;
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly BlobServiceClient _blobServiceClient = Substitute.For<BlobServiceClient>();
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();
    private readonly ILogger<DataManagementService> _logger = Substitute.For<ILogger<DataManagementService>>();
    private readonly TimeProvider _timeProvider = Substitute.For<TimeProvider>();
    private readonly IDataManagementRepository _repository = Substitute.For<IDataManagementRepository>();
    private readonly IDataManagementMapper _mapper = Substitute.For<DataManagementMapper>();
    private IConfiguration _configuration;

    private const string ContainerName = "TestContainer";
    private const int StubIndicatorId = 1;

    public DataManagementServiceTests()
    {
        var inMemorySettings = new Dictionary<string, string?> {
            {"UPLOAD_STORAGE_CONTAINER_NAME", ContainerName},
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        _service = new DataManagementService(_blobServiceClient, _configuration, _logger, _timeProvider, _repository, _mapper);

        var mockDate = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        _timeProvider.GetUtcNow().Returns(mockDate);
        _blobServiceClient.GetBlobContainerClient(ContainerName).Returns(_containerClient);
        _containerClient.GetBlobClient($"{StubIndicatorId}_{mockDate:yyyy-MM-ddTHH:mm:ss.fff}.csv").Returns(_blobClient);
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        // Arrange
        var validCsvPath = @"Services/Validation/CSVs/ValidHeadersAndValidDataRows.csv";
        string path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        UploadHealthDataResponse result;
        var publishedAt = new DateTime(2025, 1, 1, 0, 0, 0);

        // Act
        await using (FileStream stream = File.Open(path, FileMode.Open))
        {

            result = await _service.UploadFileAsync(stream, StubIndicatorId, publishedAt, "ValidHeadersAndValidDataRows.csv");
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
        string path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        ICollection<string> result;

        // Act
        using (FileStream stream = File.Open(path, FileMode.Open))
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
        string path = Path.Combine(Directory.GetCurrentDirectory(), validCsvPath);
        ICollection<string> result;

        // Act
        using (FileStream stream = File.Open(path, FileMode.Open))
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
        Should.Throw<ArgumentException>(() => _service = new DataManagementService(_blobServiceClient, _configuration, _logger, _timeProvider,
            _repository, _mapper));
    }
}