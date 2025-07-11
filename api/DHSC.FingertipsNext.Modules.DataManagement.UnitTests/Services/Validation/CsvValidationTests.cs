using Castle.Components.DictionaryAdapter;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services.Validation;

public class CsvValidationTests
{
    private readonly List<string> _csvHeaders =
    [
        "area_code",
        "date_from",
        "date_to",
        "period_type",
        "sex",
        "age_from_years_inclusive",
        "age_to_years_inclusive",
        "deprivation_decile",
        "deprivation_category",
        "count",
        "value",
        "denominator",
        "lower_ci_95",
        "upper_ci_95",
        "lower_ci_99_8",
        "upper_ci_99_8"
    ];

    /// <summary>
    /// CSV has invalid headers and data
    /// </summary>
    [Fact]
    public void TestReadInvalidHeadersAndInvalidData()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/InvalidHeadersAndInvalidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.Count.ShouldBe(_csvHeaders.Count);
        foreach (var header in _csvHeaders)
        {
            result.Errors.ShouldContain(x => x.Value == $"Header with name '{header}' was not found.");
        }

    }

    /// <summary>
    /// CSV has valid headers, but invalid data
    /// </summary>
    [Fact]
    public void TestReadValidHeadersAndInvalidData()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/ValidHeadersInvalidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.Count.ShouldBe(2);
        result.Errors[0].ErrorMessage.ShouldBeEquivalentTo("The value: '2024-01-AB' is invalid. At row 2 in column 2.");
        result.Errors[1].ErrorMessage.ShouldBeEquivalentTo("The value: '2024-12-AB' is invalid. At row 3 in column 3.");
    }

    /// <summary>
    /// CSV has no headers
    /// </summary>
    [Fact]
    public void TestReadNoHeaders()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/NoHeadersAndValidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.Count.ShouldBe(_csvHeaders.Count);
        foreach (var header in _csvHeaders)
        {
            result.Errors.ShouldContain(x => x.Value == $"Header with name '{header}' was not found.");
        }
    }

    /// <summary>
    /// CSV has no data
    /// </summary>
    [Fact]
    public void TestReadNoData()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/ValidHeadersAndNoDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem();
        result.Errors.First().ErrorMessage.ShouldBeEquivalentTo("No records found");
    }

    /// <summary>
    /// CSV is empty
    /// </summary>
    [Fact]
    public void TestReadEmpty()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/Empty.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem();
        result.Errors.First().ErrorMessage.ShouldBe("File is empty");
    }

    /// <summary>
    /// CSV has single invalid header
    /// </summary>
    [Fact]
    public void TestHasSingleInvalidHeader()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/MostlyValidHeadersAndValidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem();
        result.Errors.First().ErrorMessage.ShouldBe("Header with name 'upper_ci_99_8' was not found.");
    }

    /// <summary>
    /// CSV has extra header
    /// </summary>
    [Fact]
    public void TestHasExtraHeader()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/ExtraHeadersAndValidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.Count.ShouldBe(1);
        result.Errors.First().ErrorMessage.ShouldBe("Unexpected header(s) found: extra_header");
    }

    /// <summary>
    /// CSV has duplicate valid header
    /// </summary>
    [Fact]
    public void TestHasDuplicateValidHeader()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/DuplicateHeadersAndValidDataRows.csv");

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem();
        result.Errors.First().ErrorMessage.ShouldBe("Header with name 'date_to' was not found.");
    }

    /// <summary>
    /// CSV is valid
    /// </summary>
    [Fact]
    public void TestReadValid()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/ValidHeadersAndValidDataRows.csv");

        // Assert
        result.Success.ShouldBeTrue();
        result.Errors.ShouldBeEmpty();
    }

    [Fact]
    public void TestSwitchedHeaders()
    {
        // Arrange
        var result = ReadAndValidateCsv(@"Services/Validation/CSVs/SwitchedHeadersAndValidDataRows.csv");
        
        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.ShouldHaveSingleItem();
        result.Errors.First().ErrorMessage.ShouldBe("Unexpected header(s) found: Please ensure that the headers are in the correct order");
    }

    private static CsvValidationResult ReadAndValidateCsv(string file)
    {
        string path = Path.Combine(Directory.GetCurrentDirectory(), file);

        // Act
        CsvValidationResult result;
        using (FileStream stream = File.Open(path, FileMode.Open))
        {
            result = UploadedCsvValidator.Validate(stream);
        }

        return result;
    }
}