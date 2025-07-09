using System.Web;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
    private const int StubIndicatorId = 123;
    private const string ValidFileName = "valid.csv";
    //private const string InvalidFileName = "invalid.csv";

    private readonly IDataManagementService _dataManagementService;
    private DataManagementController _controller;

    private static readonly string FilePath = Path.Combine("TestData", ValidFileName);
    //private static readonly string InvalidFilePath = Path.Combine("TestData", InvalidFileName);
    private static readonly byte[] Bytes = File.ReadAllBytes(FilePath);
    //private static readonly byte[] InvalidBytes = File.ReadAllBytes(InvalidFilePath);
    private static readonly MemoryStream Stream = new(Bytes);
    //private static readonly MemoryStream InvalidStream = new(InvalidBytes);
    private readonly FormFile _formFile = new(Stream, 0, Bytes.Length,
        "file", ValidFileName);
    // private readonly FormFile _invalidFormFile = new(InvalidStream, 0, InvalidBytes.Length,
    //     "file", InvalidFileName);

    public DataManagementControllerTests()
    {
        _dataManagementService = Substitute.For<IDataManagementService>();
        _controller = new DataManagementController(_dataManagementService);
    }

    [Fact]
    public async Task PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        // Arrange
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");

        _dataManagementService.ValidateCsv(Arg.Any<Stream>()).Returns([]);

        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, ValidFileName)
            .Returns(new UploadHealthDataResponse(OutcomeType.Ok));
        var expected = $"File {ValidFileName} has been accepted for indicator {StubIndicatorId}.";

        // Act
        var response = await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, ValidFileName);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        response?.Value.ToString().ShouldBe(expected);
    }
    
    [Fact]
    public async Task PostReturnsExpectedErrorResponseWhenGivenAnInvalidFile()
    {
        // Arrange
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        _dataManagementService.ValidateCsv(Arg.Any<Stream>()).Returns(["No records found"]);

        // Act
        var response = await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        response?.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = response.Value as ErrorWithDetail;
        error.Message.ShouldBe("The CSV file provided was invalid.");
        error.Errors.ShouldHaveSingleItem();
        error.Errors.First().ShouldBe("No records found");
    }

    [Fact]
    public async Task NullFileReturns400()
    {
        // Arrange
        var publishedAtFormatted = "2025-01-01T00:00:00.000";

        // Act
        var result = await _controller.UploadHealthData(null, publishedAtFormatted, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = result.Value as SimpleError;
        error.Message.ShouldBe("File is empty");
    }
    
    [Theory]
    [InlineData("1234", "publishedAt is invalid. Must be in the format dd-MM-yyyyTHH:mm:ss.fff")]
    [InlineData("2025-01-01T00:00:00.000", "publishedAt cannot be in the past")]
    public async Task InvalidDateReturns400(string publishedAt, string expectedErrorMessage)
    {
        // Act
        var result = await _controller.UploadHealthData(_formFile, publishedAt, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = result.Value as SimpleError;
        error.Message.ShouldBe(expectedErrorMessage);
    }

    [Fact]
    public async Task EmptyFileReturns400()
    {
        // Arrange
        var stream = new MemoryStream(); // no data
        var formFile = new FormFile(stream, 0, 0,
            "file", "empty.csv");
        var publishedAtFormatted = "2025-01-01T00:00:00.000";

        // Act
        var result = await _controller.UploadHealthData(formFile, publishedAtFormatted, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = result.Value as SimpleError;
        error.Message.ShouldBe("File is empty");
    }

    [Fact]
    public async Task PostReturnsEncodedFilenameInResponse()
    {
        // Arrange
        const string stubFileNameWithCharsToEncode = "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var formFile = new FormFile(Stream, 0, Bytes.Length, "file", stubFileNameWithCharsToEncode);
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileNameWithCharsToEncode);
        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, expectedEncoded)
            .Returns(new UploadHealthDataResponse(OutcomeType.Ok));

        // Act
        var response = await _controller.UploadHealthData(formFile, publishedAtFormatted, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, expectedEncoded);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        response?.Value?.ToString()?.ShouldContain(expectedEncoded);
    }

    [Fact]
    public async Task RequestReturns500IfUploadFails()
    {
        // Arrange
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");

        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, Arg.Any<string>())
            .Returns(new UploadHealthDataResponse(OutcomeType.ServerError, new List<string>() { "File upload was unsuccessful." }));

        // Act
        var response = await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as ObjectResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, Arg.Any<string>());
        response?.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
        response?.Value?.ToString()?.ShouldContain("File upload was unsuccessful.");
    }

    [Fact]
    public async Task PostReturns400IfPublishedDateIsInvalid()
    {
        // Arrange
        var publishedAtIncorrect = "12345678";

        // Act
        var response = await _controller.UploadHealthData(_formFile, publishedAtIncorrect, StubIndicatorId) as ObjectResult;

        // Assert
        response?.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = response?.Value as SimpleError;
        error.Message.ShouldBe("publishedAt is invalid. Must be in the format dd-MM-yyyyTHH:mm:ss.fff");
    }
}