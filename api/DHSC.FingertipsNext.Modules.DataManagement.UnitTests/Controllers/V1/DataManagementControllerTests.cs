using System.Web;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Time.Testing;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
    private const int StubIndicatorId = 123;
    private const string ValidFileName = "valid.csv";

    private static readonly string FilePath = Path.Combine("TestData", ValidFileName);
    private static readonly byte[] Bytes = File.ReadAllBytes(FilePath);
    private static readonly MemoryStream Stream = new(Bytes);

    private readonly IDataManagementService _dataManagementService;

    private readonly FormFile _formFile = new(Stream, 0, Bytes.Length,
        "file", ValidFileName);

    private readonly DateTime _now = new(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
    private readonly DataManagementController _controller;

    public DataManagementControllerTests()
    {
        _dataManagementService = Substitute.For<IDataManagementService>();
        var fixedTimeProvider = new FakeTimeProvider();
        fixedTimeProvider.SetUtcNow(_now);
        _controller = new DataManagementController(_dataManagementService, fixedTimeProvider);
    }

    [Fact]
    public async Task PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        // Arrange
        var publishedAt = _now.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        var expectedModel = new Batch
        {
            BatchId = $"{StubIndicatorId}_{publishedAt:yyyy-MM-ddTHH:mm:ss.fff}",
            IndicatorId = StubIndicatorId,
            Status = BatchStatus.Received,
            OriginalFileName = ValidFileName,
            UserId = Guid.Empty.ToString(),
            CreatedAt = _now,
            PublishedAt = publishedAt
        };

        _dataManagementService.ValidateCsv(Arg.Any<Stream>()).Returns([]);

        _dataManagementService
            .UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, ValidFileName, Guid.Empty)
            .Returns(new UploadHealthDataResponse(OutcomeType.Ok, expectedModel));

        // Act
        var response =
            await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1)
            .UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, ValidFileName, Guid.Empty);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        var model = response?.Value as Batch;
        model.ShouldBeEquivalentTo(expectedModel);
    }


    [Fact]
    public async Task PostReturnsExpectedErrorResponseWhenGivenAnInvalidFile()
    {
        // Arrange
        var publishedAt = _now.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        _dataManagementService.ValidateCsv(Arg.Any<Stream>()).Returns(["No records found"]);

        // Act
        var response =
            await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as
                BadRequestObjectResult;

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
        const string publishedAtFormatted = "2025-01-01T00:00:00.000";

        // Act
        var result =
            await _controller.UploadHealthData(null, publishedAtFormatted, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);
        var error = result.Value as SimpleError;
        error.Message.ShouldBe("File is empty");
    }

    [Theory]
    [InlineData("1234", "publishedAt is invalid. Must be in the format dd-MM-yyyyTHH:mm:ss.fff")]
    [InlineData("2024-01-01T00:00:00.000", "publishedAt cannot be in the past")]
    public async Task InvalidDateReturns400(string publishedAt, string expectedErrorMessage)
    {
        // Act
        var result =
            await _controller.UploadHealthData(_formFile, publishedAt, StubIndicatorId) as BadRequestObjectResult;

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
        const string publishedAtFormatted = "2025-01-01T00:00:00.000";

        // Act
        var result =
            await _controller.UploadHealthData(formFile, publishedAtFormatted, StubIndicatorId) as
                BadRequestObjectResult;

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
        const string
            stubFileNameWithCharsToEncode =
                "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var formFile = new FormFile(Stream, 0, Bytes.Length, "file", stubFileNameWithCharsToEncode);
        var publishedAt = _now.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileNameWithCharsToEncode);
        _dataManagementService
            .UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, expectedEncoded, Guid.Empty)
            .Returns(new UploadHealthDataResponse(OutcomeType.Ok));

        // Act
        var response =
            await _controller.UploadHealthData(formFile, publishedAtFormatted, StubIndicatorId) as AcceptedResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt,
            expectedEncoded, Guid.Empty);
        response?.StatusCode.ShouldBe(StatusCodes.Status202Accepted);
        response?.Value?.ToString()?.ShouldContain(expectedEncoded);
    }

    [Fact]
    public async Task RequestReturns500IfUploadFails()
    {
        // Arrange
        var publishedAt = _now.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        var expectedModel = new Batch
        {
            BatchId = $"{StubIndicatorId}_{publishedAt:yyyy-MM-ddTHH:mm:ss.fff}",
            IndicatorId = StubIndicatorId,
            Status = BatchStatus.Received,
            OriginalFileName = ValidFileName,
            UserId = Guid.Empty.ToString(),
            CreatedAt = _now,
            PublishedAt = publishedAt
        };

        _dataManagementService.UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt, "valid.csv", Guid.Empty)
            .Returns(new UploadHealthDataResponse(OutcomeType.ServerError, expectedModel,
                new List<string> { "File upload was unsuccessful." }));

        // Act
        var response =
            await _controller.UploadHealthData(_formFile, publishedAtFormatted, StubIndicatorId) as ObjectResult;

        // Assert
        await _dataManagementService.Received(1).UploadFileAsync(Arg.Any<Stream>(), StubIndicatorId, publishedAt,
            Arg.Any<string>(), Guid.Empty);
        response?.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
        response?.Value?.ToString()?.ShouldContain("File upload was unsuccessful.");
    }
}