using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class FileUploadIntegrationTests : DataManagementIntegrationTests
{
    private const string TestDataDir = "TestData";

    // Uses a different indicator ID from other tests, to avoid conflicting
    // when run in parallel.
    private const int IndicatorId = 41203;
    private const string Indicator41203GroupRoleId = "eeea2d1a-0697-48e2-8834-ee64ef6694da";

    private const string IntegrationTestFileName = "file-upload-integration-test.csv";

    private readonly AzureStorageBlobClient _azureStorageBlobClient;
    private readonly string _blobName;
    private readonly DateTime _publishedAt = new(2024, 7, 15, 10, 30, 45, 123, DateTimeKind.Utc);

    public FileUploadIntegrationTests(WebApplicationFactoryWithAuth<Program> factory) : base(factory)
    {
        // Load configuration from the test JSON file.
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .AddEnvironmentVariables()
            .Build();

        _blobName = $"{IndicatorId}_{FormattedMockTime}.csv";
        _azureStorageBlobClient = new AzureStorageBlobClient(configuration);
    }

    protected override void Dispose(bool disposing)
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, "file-upload-cleanup.sql");
        RunSqlScript(cleanupPath, Connection);

        _azureStorageBlobClient.DeleteBlob(_blobName);

        base.Dispose(disposing);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    [InlineData(Indicator41203GroupRoleId, Indicator383GroupRoleId)]
    public async Task AuthorisedRequestToDataManagementEndpointShouldUploadAFile(params string[] userRoleIds)
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(_publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken(userRoleIds));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.EnsureSuccessStatusCode();

        var model = await response.Content.ReadFromJsonAsync<Batch>();
        model.ShouldBe(new Batch
        {
            BatchId = $"{IndicatorId}_{FormattedMockTime}",
            IndicatorId = IndicatorId,
            OriginalFileName = IntegrationTestFileName,
            CreatedAt = MockTime,
            PublishedAt = _publishedAt,
            DeletedAt = null,
            UserId = Factory.SubClaim,
            DeletedUserId = null,
            Status = BatchStatus.Received
        });

        var blobContent = await _azureStorageBlobClient.DownloadBlob(_blobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }

    [Fact]
    public async Task UnauthorisedRequestToDataManagementEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task ExpiredRequestToDataManagementEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([Indicator41203GroupRoleId], true));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task InvalidRoleForIndicatorShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([Indicator41203GroupRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri("/indicators/9999/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task ATokenWithoutASubClaimShouldBeRejectedByUploadBatchEndpoint()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        using var content = new MultipartFormDataContent();
        const bool includeSubClaimInToken = false;

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(_publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator41203GroupRoleId], false, includeSubClaimInToken));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    public async Task UploadFailuresShouldReturn500Response(string userRoleId)
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(_publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([userRoleId]));

        // Act
        await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    public async Task UploadingInvalidFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "invalid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(_publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }


    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    public async Task UploadingEmptyFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(Stream.Null);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", IntegrationTestFileName);

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    public async Task UploadingNoFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41203GroupRoleId)]
    public async Task UploadToBlobStorageShouldFailIfContainerDoesNotExist(string userRoleId)
    {
        // Arrange
        var apiClient = Factory.WithWebHostBuilder(config => config.UseSetting("UPLOAD_STORAGE_CONTAINER_NAME", "invalid-container-name")).CreateClient();

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(_publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }
}