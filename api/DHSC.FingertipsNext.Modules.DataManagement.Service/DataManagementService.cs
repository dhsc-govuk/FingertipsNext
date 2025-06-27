using Azure;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService: IDataManagementService
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

    private static readonly Action<ILogger, string?, Exception?> InvalidConfigLog = LoggerMessage.Define<string?>(
        LogLevel.Debug,
        new EventId(4, "InvalidConfigLog"),
        "Config variable 'STORAGE_CONTAINER_NAME' is invalid: {ContainerName}");

    private readonly BlobServiceClient _blobServiceClient;
    private readonly ILogger<DataManagementService> _logger;
    private readonly TimeProvider _timeProvider;
    private readonly string? _containerName;

    public DataManagementService(BlobServiceClient blobServiceClient, IConfiguration configuration, ILogger<DataManagementService> logger, TimeProvider timeProvider)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        _blobServiceClient = blobServiceClient;
        _logger = logger;
        _timeProvider = timeProvider;
        _containerName = configuration["STORAGE_CONTAINER_NAME"];
    }

    public async Task<bool> UploadFileAsync(Stream fileStream, int indicatorId)
    {
        if (string.IsNullOrWhiteSpace(_containerName))
        {
            InvalidConfigLog(_logger, _containerName, null);
            return false;
        }

        var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
        var batchId = $"{indicatorId}_{_timeProvider.GetUtcNow():yyyy-MM-ddTHH:mm:ss.fff}";

        var blobClient = containerClient.GetBlobClient($"{batchId}.csv");

        try
        {
            UploadDebugLog(_logger, batchId, _containerName, null);
            await blobClient.UploadAsync(fileStream);
            UploadSuccessfulLog(_logger, null);
        }
        catch (Exception exception) when (exception is RequestFailedException or AggregateException)
        {
            UploadErrorLog(_logger, exception.Message, exception);
            return false;
        }

        return true;
    }
}