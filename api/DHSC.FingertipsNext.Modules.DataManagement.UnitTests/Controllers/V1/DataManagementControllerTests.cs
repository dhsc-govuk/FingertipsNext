using System.Web;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
    private const int StubIndicatorId = 123;
    private const string StubFileName = "StubHealthdataUpload.csv";

    private IConfiguration _configuration;
    private readonly IDataManagementService _dataManagementService;
    private DataManagementController _controller;

    private static readonly string FilePath = Path.Combine("TestData", StubFileName);
    private static readonly byte[] Bytes = File.ReadAllBytes(FilePath);
    private static readonly MemoryStream Stream = new(Bytes);
    private readonly FormFile _formFile = new(Stream, 0, Bytes.Length,
        "file", StubFileName);

    public DataManagementControllerTests()
    {
        var inMemorySettings = new Dictionary<string, string?> {
            {"STORAGE_CONTAINER_NAME", "StubContainerName"},
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();
        _dataManagementService = Substitute.For<IDataManagementService>();
        _controller = new DataManagementController(_dataManagementService, _configuration);
    }

    [Fact]
    public async Task PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubFileName, "StubContainerName")
            .Returns(true);
        var response = await _controller.UploadHealthData(_formFile, StubIndicatorId) as AcceptedResult;
        var expected = $"File {StubFileName} has been accepted for indicator {StubIndicatorId}.";

        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubFileName, "StubContainerName");
        response?.StatusCode.ShouldBe(202);
        response?.Value.ToString().ShouldBe(expected);
    }

    [Fact]
    public async Task NullFileReturns400()
    {
        // Act
        var result = await _controller.UploadHealthData(null, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public async Task EmptyFileReturns400()
    {
        // Arrange
        var stream = new MemoryStream(); // no data
        var formFile = new FormFile(stream, 0, 0,
            "file", "empty.csv");

        // Act
        var result = await _controller.UploadHealthData(formFile, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public async Task PostReturnsEncodedFilenameInResponse()
    {
        // Arrange
        const string stubFileNameWithCharsToEncode = "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var formFile = new FormFile(Stream, 0, Bytes.Length, "file", stubFileNameWithCharsToEncode);
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileNameWithCharsToEncode);
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), expectedEncoded, "StubContainerName")
            .Returns(true);

        // Act
        var response = await _controller.UploadHealthData(formFile, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), Arg.Any<string>(), Arg.Any<string>());
        response?.StatusCode.ShouldBe(202);
        response?.Value?.ToString()?.ShouldContain(expectedEncoded);
    }

    [Fact]
    public async Task RequestReturns500IfEnvironmentVariableNotFound()
    {
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { { "STORAGE_CONTAINER_NAME", "" } })
            .Build();
        _controller = new DataManagementController(_dataManagementService, _configuration);

        var response = await _controller.UploadHealthData(_formFile, StubIndicatorId) as StatusCodeResult;

        response.StatusCode.ShouldBe(500);
    }

    [Fact]
    public async Task RequestReturns500IfUploadFails()
    {
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubFileName, "StubContainerName")
            .Returns(false);

        var response = await _controller.UploadHealthData(_formFile, StubIndicatorId) as StatusCodeResult;

        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubFileName, "StubContainerName");
        response?.StatusCode.ShouldBe(500);
    }
}