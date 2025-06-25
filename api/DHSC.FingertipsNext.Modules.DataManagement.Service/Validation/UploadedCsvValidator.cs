using System.Collections.ObjectModel;
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

/// <summary>
/// This only performs basic validation on the structure and data.
/// </summary>
public static class UploadedCsvValidator
{

    /// <summary>
    /// Reads the CSV file and attempts to build a list of UploadedIndicatorDataRow
    /// This will log any validation errors
    /// </summary>
    /// <param name="path"></param>
    public static CsvValidationResult Validate(string path)
    {
        var errors = new List<CsvValidationError>();
        var csvReaderConfiguration = _setupCsvReaderConfiguration(errors);

        using (var reader = new StreamReader(path))
        using (var csv = new CsvReader(reader, csvReaderConfiguration))
        {
            csv.Context.RegisterClassMap<UploadedIndicatorDataRowMap>();
            var records = csv.GetRecords<UploadedIndicatorDataRow>();

            try
            {
                // Do not call .ToList() on records, as this will bring the entire CSV structure into memory
                // Turn into a for loop
                foreach (UploadedIndicatorDataRow row in records)
                {
                    Console.WriteLine(row.AreaCode);
                }
            }
            catch (HeaderValidationException ex)
            {
                foreach (var headerError in _formatHeaderErrors(ex.Message))
                {
                    CsvValidationError error = new CsvValidationError(headerError, 1, 1);
                    errors.Add(error);
                }
            }
        }

        if (errors.Count != 0)
            return new CsvValidationResult(false, new Collection<CsvValidationError>(errors));
        else
            return new CsvValidationResult(true, new Collection<CsvValidationError>());
    }

    private static List<string> _formatHeaderErrors(string message)
    {
        var headerErrors = message.Split('\n').Where(m => m.StartsWith("Header with name", StringComparison.InvariantCulture)).ToList();
        for (var i = 0; i < headerErrors.Count; i++)
        {
            headerErrors[i] = headerErrors.ElementAt(i).Replace("[0]", "", StringComparison.InvariantCulture);
        }

        return headerErrors;
    }

    private static CsvConfiguration _setupCsvReaderConfiguration(List<CsvValidationError> errors)
    {
        return new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            ReadingExceptionOccurred = (args) => _logError(args, errors)
        };
    }

    private static bool _logError(ReadingExceptionOccurredArgs args, List<CsvValidationError> errors)
    {
        if (args.Exception is FieldValidationException exception)
        {
            if (exception.Context != null && exception.Context.Reader != null && exception.Context.Parser != null)
            {
                CsvValidationError error = new CsvValidationError(exception.Field, exception.Context.Parser.Row, exception.Context.Reader.CurrentIndex);
                errors.Add(error);
            }
        }

        return false;
    }
}

public class CsvValidationError(string value, int row, int column)
{
    public string Value { get; set; } = value;
    public int Row { get; set; } = row;
    public int Column { get; set; } = column;

    public string ErrorMessage => $"The value: '{Value}' is invalid. At row {Row} in column {Column}.";
}

public class CsvValidationResult
{
    public CsvValidationResult(bool success, Collection<CsvValidationError> errors)
    {
        Success = success;
        Errors = errors;
    }

    public bool Success { get; }
    public Collection<CsvValidationError> Errors { get; }
}