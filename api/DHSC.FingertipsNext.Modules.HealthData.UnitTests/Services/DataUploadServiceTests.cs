using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class DataUploadServiceTests
{
    private readonly DataUploadService _service;
    private readonly BlobServiceClient _blobServiceClient;
    private readonly HttpClient _httpClient;
    private readonly BlobContainerClient _containerClient = Substitute.For<BlobContainerClient>();
    private readonly BlobClient _blobClient = Substitute.For<BlobClient>();

    public DataUploadServiceTests()
    {
        _blobServiceClient = Substitute.For<BlobServiceClient>();
        _httpClient = Substitute.For<HttpClient>();
        
        _service = new DataUploadService(_blobServiceClient, _httpClient, new CsvValidationService());
    }

    [Fact]
    public async Task UploadShouldSucceed()
    {
        const string containerName = "TestContainer";
        const string blobName = "TestBlob";
        _blobServiceClient.GetBlobContainerClient(containerName).Returns(_containerClient);
        _containerClient.GetBlobClient(blobName).Returns(_blobClient);
        
        var result = await _service.UploadWithSdkAsync(Stream.Null, blobName,  containerName);

        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.Status.ShouldBe(ResponseStatus.Success);
        result.Content.ShouldBe(true);
    }
    
    [Fact]
    public async Task UploadShouldFail()
    {
        const string containerName = "TestContainer";
        const string blobName = "TestBlob";
        _blobServiceClient.GetBlobContainerClient(containerName).Returns(_containerClient);
        _containerClient.GetBlobClient(blobName).Returns(_blobClient);

        _blobClient
            .When(x => x.UploadAsync(Arg.Any<Stream>(), true))
            .Do(x => throw new RequestFailedException("failed"));
        
        var result = await _service.UploadWithSdkAsync(Stream.Null, blobName,  containerName);

        await _blobClient.Received(1).UploadAsync(Arg.Any<Stream>(), true);
        result.Status.ShouldBe(ResponseStatus.Unknown);
        result.Content.ShouldBe(false);
    }
}