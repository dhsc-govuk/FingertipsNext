using Castle.Components.DictionaryAdapter;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Services.Validation;

public class CsvValidationTests
{
    /// <summary>
    /// CSV has invalid columns and data
    /// </summary>
    [Fact]
    public void TestReadInvalid()
    {
        // Arrange
        string path = Path.Combine(Directory.GetCurrentDirectory(), @"Services/Validation/CSVs/Invalid.csv");

        // Act
        CsvValidationResult result;
        using (FileStream stream = File.Open(path, FileMode.Open))
        {
            result = UploadedCsvValidator.Validate(stream);
        }

        // Assert
        result.Success.ShouldBeFalse();

        List<string> missingHeaders = new List<string>()
        {
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
        };
        result.Errors.Count.ShouldBe(missingHeaders.Count);
        foreach (var header in missingHeaders)
        {
            result.Errors.ShouldContain(x => x.Value == $"Header with name '{header}' was not found.");
        }
    }

    /// <summary>
    /// CSV has valid columns, but invalid data
    /// </summary>
    [Fact]
    public void TestReadInvalidWithValidHeaders()
    {
        // Arrange
        string path = Path.Combine(Directory.GetCurrentDirectory(), @"Services/Validation/CSVs/ValidHeaders.csv");

        // Act
        CsvValidationResult result;
        using (FileStream stream = File.Open(path, FileMode.Open))
        {
            result = UploadedCsvValidator.Validate(stream);
        }

        // Assert
        result.Success.ShouldBeFalse();
        result.Errors.Count.ShouldBe(2);
        result.Errors[0].ErrorMessage.ShouldBeEquivalentTo("The value: '2024-01-AB' is invalid. At row 2 in column 2.");
        result.Errors[1].ErrorMessage.ShouldBeEquivalentTo("The value: '2024-12-AB' is invalid. At row 3 in column 3.");
    }

    /// <summary>
    /// CSV is valid
    /// </summary>
    [Fact]
    public void TestReadValid()
    {
        // Arrange
        string path = Path.Combine(Directory.GetCurrentDirectory(), @"Services/Validation/CSVs/Valid.csv");

        // Act
        CsvValidationResult result;
        using (FileStream stream = File.Open(path, FileMode.Open))
        {
            result = UploadedCsvValidator.Validate(stream);
        }

        // Assert
        result.Success.ShouldBeTrue();
        result.Errors.ShouldBeEmpty();
    }
}