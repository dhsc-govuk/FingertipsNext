using System.Text.Json;
using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Clients;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models.LogClasses;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService : IDataManagementService
{
    private static readonly Action<ILogger, string, Exception?> UploadErrorLog = LoggerMessage.Define<string>(
        LogLevel.Error,
        new EventId(1, "UploadErrorLog"),
        "Upload to Blob Storage failed: {ErrorMessage}");

    private static readonly Action<ILogger, string, string, Exception?> UploadDebugLog =
        LoggerMessage.Define<string, string>(
            LogLevel.Debug,
            new EventId(2, "UploadDebugLog"),
            "Uploading file with batchId {BatchId} to container: {ContainerName}");

    private static readonly Action<ILogger, string, Exception?> UploadSuccessfulLog = LoggerMessage.Define<string>(
        LogLevel.Information,
        new EventId(3, "UploadSuccessfulLog"),
        "{LogObject}");

    private static readonly Action<ILogger, string, Exception?> DeleteSuccessfulLog = LoggerMessage.Define<string>(
        LogLevel.Information,
        new EventId(4, "DeleteSuccessfulLog"),
        "{LogObject}");

    private readonly BlobServiceClient _blobServiceClient;
    private readonly string _containerName;
    private readonly IHealthDataClient _healthDataClient;
    private readonly ILogger<DataManagementService> _logger;
    private readonly IDataManagementMapper _mapper;
    private readonly IDataManagementRepository _repository;
    private readonly TimeProvider _timeProvider;

    public DataManagementService(BlobServiceClient blobServiceClient, IConfiguration configuration,
        ILogger<DataManagementService> logger, TimeProvider timeProvider, IDataManagementRepository repository,
        IDataManagementMapper mapper, IHealthDataClient healthDataClient)
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
        _mapper = mapper;
        _healthDataClient = healthDataClient;
    }

    public async Task<UploadHealthDataResponse> UploadFileAsync(Stream fileStream, int indicatorId,
        DateTime publishedAt, string originalFileName, Guid userId)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var batchId = $"{indicatorId}_{_timeProvider.GetUtcNow():yyyy-MM-ddTHH:mm:ss.fff}";

        var blobClient = containerClient.GetBlobClient($"{batchId}.csv");
        Batch? model = null;

        try
        {
            UploadDebugLog(_logger, batchId, _containerName, null);
            await blobClient.UploadAsync(fileStream);
            WriteUploadSuccessLog(_logger, originalFileName, _timeProvider.GetUtcNow().UtcDateTime,
                userId, publishedAt, batchId, indicatorId);


            model = await CreateAndInsertBatchDetails(indicatorId, publishedAt, batchId, originalFileName);
        }
        catch (Exception exception) when (exception is RequestFailedException or AggregateException)
        {
            UploadErrorLog(_logger, exception.Message, exception);
            return new UploadHealthDataResponse(OutcomeType.ServerError, null,
                new List<string> { "An unexpected error occurred" });
        }

        return new UploadHealthDataResponse(OutcomeType.Ok, model);
    }

    public ICollection<string> ValidateCsv(Stream fileStream)
    {
        var csvValidationResult = UploadedCsvValidator.Validate(fileStream);
        if (!csvValidationResult.Success)
        {
            return csvValidationResult.Errors.Select(e => e.ErrorMessage).ToList();
        }

        return [];
    }

    public async Task<IEnumerable<Batch>> ListBatches(int[] indicatorIds)
    {
        ArgumentNullException.ThrowIfNull(indicatorIds);

        IEnumerable<BatchModel> batches;
        if (indicatorIds.Length > 0)
        {
            batches = await _repository.GetBatchesByIdsAsync(indicatorIds);
        }
        else
        {
            batches = await _repository.GetAllBatchesAsync();
        }


        return batches.Select(batch => _mapper.Map(batch));
    }

    public async Task<UploadHealthDataResponse> DeleteBatchAsync(string batchId, Guid userId,
        IList<int> indicatorsThatCanBeModified)
    {
        ArgumentNullException.ThrowIfNull(batchId);
        ArgumentNullException.ThrowIfNull(indicatorsThatCanBeModified);
        var errorMessage = "";

        try
        {
            var batchToDelete = await _repository.GetBatchByIdAsync(batchId);

            if (batchToDelete == null)
            {
                throw new ArgumentException("BatchNotFound");
            }

            if (indicatorsThatCanBeModified.Any() &&
                !indicatorsThatCanBeModified.Contains(batchToDelete.IndicatorId))
            {
                throw new ArgumentException("PermissionDenied");
            }

            if (batchToDelete is { DeletedAt: not null, Status: BatchStatus.Deleted })
            {
                throw new ArgumentException("BatchDeleted");
            }

            if (batchToDelete.PublishedAt <= _timeProvider.GetUtcNow().UtcDateTime)
            {
                throw new ArgumentException("BatchPublished");
            }

            // Delete batch
            var deletedBatch = await _repository.DeleteBatchAsync(batchToDelete, userId);

            if (deletedBatch != null)
            {
                // Delete associated health data
                await _healthDataClient.DeleteHealthDataAsync(batchId);

                // Write delete log
                WriteDeleteSuccessLog(_logger, deletedBatch, deletedBatch.DeletedAt);
                return new UploadHealthDataResponse(OutcomeType.Ok, _mapper.Map(deletedBatch));
            }
        }
        catch (Exception e) when (e is ArgumentException)
        {
            errorMessage = e.Message;
        }

        return errorMessage switch
        {
            "BatchNotFound" => new UploadHealthDataResponse(OutcomeType.NotFound, null, ["Not found"]),
            "BatchDeleted" => new UploadHealthDataResponse(OutcomeType.ClientError, null, ["Batch already deleted"]),
            "BatchPublished" =>
                new UploadHealthDataResponse(OutcomeType.ClientError, null, ["Batch already published"]),
            "PermissionDenied" => new UploadHealthDataResponse(OutcomeType.PermissionDenied, null,
                ["Permission denied when deleting batch"]),
            _ => new UploadHealthDataResponse(OutcomeType.ServerError, null, ["An unexpected error occurred"])
        };
    }

    private async Task<Batch> CreateAndInsertBatchDetails(int indicatorId, DateTime publishedAt, string batchId,
        string originalFileName)
    {
        var model = new BatchModel
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
        return _mapper.Map(model);
    }

    private static void WriteUploadSuccessLog(ILogger<DataManagementService> logger, string originalFileName,
        DateTime valueLastModified, Guid userId, DateTime publishedAt, string batchId, int indicatorId)
    {
        var logObject = new BatchUploadLog
        {
            BatchId = batchId,
            Timestamp = valueLastModified,
            IndicatorId = indicatorId,
            OriginalFileName = originalFileName,
            UserId = userId,
            PublishedAt = publishedAt,
        };

        UploadSuccessfulLog(logger, JsonSerializer.Serialize(logObject), null);
    }

    private static void WriteDeleteSuccessLog(ILogger<DataManagementService> logger, BatchModel deletedBatch,
        DateTime? timestamp)
    {
        var logObject = new BatchDeleteLog
        {
            BatchId = deletedBatch.BatchId,
            Timestamp = timestamp,
            UserId = deletedBatch.DeletedUserId,
            IndicatorId = deletedBatch.IndicatorId,
            OriginalFileName = deletedBatch.OriginalFileName,
            PublishedAt = deletedBatch.PublishedAt
        };

        DeleteSuccessfulLog(logger, JsonSerializer.Serialize(logObject), null);
    }
}