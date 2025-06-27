using System.Web;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http;
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

    private readonly IDataManagementService _dataManagementService;
    private DataManagementController _controller;

    private static readonly string FilePath = Path.Combine("TestData", StubFileName);
    private static readonly byte[] Bytes = File.ReadAllBytes(FilePath);
    private static readonly MemoryStream Stream = new(Bytes);
    private readonly FormFile _formFile = new(Stream, 0, Bytes.Length,
        "file", StubFileName);

    public DataManagementControllerTests()
    {
        _dataManagementService = Substitute.For<IDataManagementService>();
        _controller = new DataManagementController(_dataManagementService);
    }

    [Fact]
    public async Task PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        // Arrange
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId)
            .Returns(true);
        var expected = $"File {StubFileName} has been accepted for indicator {StubIndicatorId}.";

        // Act
        var response = await _controller.UploadHealthData(_formFile, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        response?.Value.ToString().ShouldBe(expected);
    }

    [Fact]
    public async Task NullFileReturns400()
    {
        // Act
        var result = await _controller.UploadHealthData(null, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
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
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task PostReturnsEncodedFilenameInResponse()
    {
        // Arrange
        const string stubFileNameWithCharsToEncode = "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var formFile = new FormFile(Stream, 0, Bytes.Length, "file", stubFileNameWithCharsToEncode);
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileNameWithCharsToEncode);
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId)
            .Returns(true);

        // Act
        var response = await _controller.UploadHealthData(formFile, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        response?.Value?.ToString()?.ShouldContain(expectedEncoded);
    }

    [Fact]
    public async Task RequestReturns500IfUploadFails()
    {
        // Arrange
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId)
            .Returns(false);

        // Act
        var response = await _controller.UploadHealthData(_formFile, StubIndicatorId) as ObjectResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId);
        response?.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
        response?.Value?.ToString()?.ShouldContain("File upload was unsuccessful.");
    }
}