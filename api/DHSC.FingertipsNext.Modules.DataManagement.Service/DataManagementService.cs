﻿using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Clients;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
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

    private static readonly Action<ILogger, Exception?> UploadSuccessfulLog = LoggerMessage.Define(
        LogLevel.Information,
        new EventId(3, nameof(UploadFileAsync)),
        "Upload successful");

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

    public async Task<UploadHealthDataResponse> UploadFileAsync(Stream fileStream, int indicatorId, string userId,
        DateTime publishedAt, string originalFileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var batchId = $"{indicatorId}_{_timeProvider.GetUtcNow():yyyy-MM-ddTHH:mm:ss.fff}";

        var blobClient = containerClient.GetBlobClient($"{batchId}.csv");
        Batch? model;

        try
        {
            UploadDebugLog(_logger, batchId, _containerName, null);
            await blobClient.UploadAsync(fileStream);
            UploadSuccessfulLog(_logger, null);

            model = await CreateAndInsertBatchDetails(indicatorId, userId, publishedAt, batchId, originalFileName);
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

    public async Task<UploadHealthDataResponse> DeleteBatchAsync(string batchId, string userId, IList<int> indicatorsThatCanBeModified)
    {
        ArgumentNullException.ThrowIfNull(batchId);
        var errorMessage = "";

        try
        {
            // Delete batch
            var deletedBatch = await _repository.DeleteBatchAsync(batchId, userId, indicatorsThatCanBeModified);

            if (deletedBatch != null)
            {
                // Delete associated health data
                var hasHealthDataBeenDeleted = await _healthDataClient.DeleteHealthDataAsync(batchId);

                if (hasHealthDataBeenDeleted)
                {
                    return new UploadHealthDataResponse(OutcomeType.Ok, _mapper.Map(deletedBatch));
                }
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
            "PermissionDenied" => new UploadHealthDataResponse(OutcomeType.PermissionDenied, null, ["Permission denied when deleting batch"]),
            _ => new UploadHealthDataResponse(OutcomeType.ServerError)
        };
    }

    private async Task<Batch> CreateAndInsertBatchDetails(int indicatorId, string userId, DateTime publishedAt, string batchId,
        string originalFileName)
    {
        var model = new BatchModel
        {
            BatchId = batchId,
            IndicatorId = indicatorId,
            OriginalFileName = originalFileName,
            PublishedAt = publishedAt.ToUniversalTime(),
            UserId = userId,
            Status = BatchStatus.Received,
            CreatedAt = _timeProvider.GetUtcNow().DateTime
        };
        await _repository.AddBatchAsync(model);
        return _mapper.Map(model);
    }
}