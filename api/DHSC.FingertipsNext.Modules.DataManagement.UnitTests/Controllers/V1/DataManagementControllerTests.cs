using System.Web;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests : IDisposable
{
    // private readonly DataManagementController _controller = new();
    private const int StubIndicatorId = 123;
    private const string StubFileName = "StubHealthdataUpload.csv";

    private static readonly string FilePath = Path.Combine("TestData", StubFileName);
    private static readonly byte[] Bytes = File.ReadAllBytes(FilePath);
    private static readonly MemoryStream Stream = new(Bytes);
    private readonly FormFile _formFile = new(Stream, 0, Bytes.Length,
        "file", StubFileName);

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            Stream.Dispose();
        }
    }

    [Fact]
    public void PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        var response = DataManagementController.UploadHealthData(_formFile, StubIndicatorId) as AcceptedResult;
        var expected = $"File {StubFileName} has been accepted for indicator {StubIndicatorId}.";

        response?.StatusCode.ShouldBe(202);
        (response?.Value.ToString() ?? string.Empty).ShouldBe(expected);
    }

    [Fact]
    public void NullFileReturns400()
    {
        // Act
        var result = DataManagementController.UploadHealthData(null, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public void EmptyFileReturns400()
    {
        // Arrange
        var stream = new MemoryStream(); // no data
        var formFile = new FormFile(stream, 0, 0,
            "file", "empty.csv");

        // Act
        var result = DataManagementController.UploadHealthData(formFile, StubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public void PostReturnsEncodedFilenameInResponse()
    {
        // Arrange
        const string stubFileNameWithCharsToEncode = "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var formFile = new FormFile(Stream, 0, Bytes.Length, "file", stubFileNameWithCharsToEncode);
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileNameWithCharsToEncode);

        // Act
        var response = DataManagementController.UploadHealthData(formFile, StubIndicatorId) as AcceptedResult;

        // Assert
        response?.StatusCode.ShouldBe(202);
        (response?.Value.ToString() ?? string.Empty).ShouldContain(expectedEncoded);
    }
}