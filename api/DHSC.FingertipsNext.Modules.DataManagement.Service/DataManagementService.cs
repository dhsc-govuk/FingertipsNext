using Azure;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService : IDataManagementService
{
    private static readonly Action<ILogger, string, Exception?> UploadErrorLog = LoggerMessage.Define<string>(
        LogLevel.Error,
        new EventId(1, "UploadErrorLog"),
        "Upload to Blob Storage failed: {ErrorMessage}");

    private static readonly Action<ILogger, string, string, Exception?> UploadDebugLog = LoggerMessage.Define<string, string>(
        LogLevel.Debug,
        new EventId(2, "UploadDebugLog"),
        "Uploading file with batchId {BatchId} to container: {ContainerName}");

    private static readonly Action<ILogger, Exception?> UploadSuccessfulLog = LoggerMessage.Define(
        LogLevel.Information,
        new EventId(3, nameof(UploadFileAsync)),
        "Upload successful");

    private readonly BlobServiceClient _blobServiceClient;
    private readonly ILogger<DataManagementService> _logger;
    private readonly TimeProvider _timeProvider;
    private readonly string _containerName;
    private readonly IDataManagementRepository _repository;

    public DataManagementService(BlobServiceClient blobServiceClient, IConfiguration configuration, ILogger<DataManagementService> logger, TimeProvider timeProvider, IDataManagementRepository repository)
    {

        
        ArgumentNullException.ThrowIfNull(configuration);
        ArgumentException.ThrowIfNullOrWhiteSpace(configuration["UPLOAD_STORAGE_CONTAINER_NAME"]);
        var containerName = configuration["UPLOAD_STORAGE_CONTAINER_NAME"];
        ArgumentException.ThrowIfNullOrWhiteSpace(containerName);
        _blobServiceClient = blobServiceClient;
        _logger = logger;
        _timeProvider = timeProvider;
        _repository = repository;
        _containerName = containerName;
        
        _blobServiceClient = blobServiceClient;
        _logger = logger;
        _timeProvider = timeProvider;
        _repository = repository;
    }

    public async Task<UploadHealthDataResponse> UploadFileAsync(Stream fileStream, int indicatorId, DateTime publishedAt, string originalFileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var batchId = $"{indicatorId}_{_timeProvider.GetUtcNow():yyyy-MM-ddTHH:mm:ss.fff}";

        var blobClient = containerClient.GetBlobClient($"{batchId}.csv");

        try
        {
            UploadDebugLog(_logger, batchId, _containerName, null);
            await blobClient.UploadAsync(fileStream);
            UploadSuccessfulLog(_logger, null);
            
            await CreateAndInsertBatchDetails(indicatorId, publishedAt, batchId, originalFileName);
        }
        catch (Exception exception) when (exception is RequestFailedException or AggregateException)
        {
            UploadErrorLog(_logger, exception.Message, exception);
            return new UploadHealthDataResponse(OutcomeType.ServerError,
                new List<string>() { "An unexpected error occurred" });
        }

        return new UploadHealthDataResponse(OutcomeType.Ok);
    }

    public ICollection<string> ValidateCsv(Stream fileStream)
    {
        var csvValidationResult = UploadedCsvValidator.Validate(fileStream);
        if (!csvValidationResult.Success)
            return csvValidationResult.Errors.Select(e => e.ErrorMessage).ToList();

        return [];
    }

    private async Task CreateAndInsertBatchDetails(int indicatorId, DateTime publishedAt, string batchId, string originalFileName)
    {
        BatchModel model = new BatchModel
        {
            BatchId = batchId,
            IndicatorId = indicatorId,
            OriginalFileName = originalFileName,
            PublishedAt = publishedAt.ToUniversalTime(),
            UserId = Guid.Empty, //Can only properly set this when the auth is implemented
            Status = BatchStatus.Received,
            CreatedAt = DateTime.UtcNow
        };
        await _repository.AddBatchAsync(model);
    }
}