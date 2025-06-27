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
    /// <param name="stream"></param>
    public static CsvValidationResult Validate(Stream stream)
    {
        var errors = new List<CsvValidationError>();
        var csvReaderConfiguration = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            ReadingExceptionOccurred = (args) => LogError(args, errors)
        };

        using (var reader = new StreamReader(stream))
        using (var csv = new CsvReader(reader, csvReaderConfiguration))
        {
            csv.Context.RegisterClassMap<UploadedIndicatorDataRowMap>();
            var records = csv.GetRecords<UploadedIndicatorDataRow>();

            try
            {
                // Do not call .ToList() on records, as this will bring the entire CSV structure into memory
                foreach (UploadedIndicatorDataRow row in records)
                {
                    // Need the foreach to trigger the validation
                }
            }
            catch (HeaderValidationException ex)
            {
                foreach (var headerError in FormatHeaderErrors(ex.Message))
                {
                    CsvValidationError error = new CsvValidationError(headerError, 1, 1);
                    errors.Add(error);
                }
            }
        }

        return errors.Count != 0 ? new CsvValidationResult(false, new Collection<CsvValidationError>(errors)) : new CsvValidationResult(true, new Collection<CsvValidationError>());
    }

    private static List<string> FormatHeaderErrors(string message)
    {
        var headerErrors = message.Split('\n')
            .Where(m => m.StartsWith("Header with name", StringComparison.InvariantCulture)).ToList();
        for (var i = 0; i < headerErrors.Count; i++)
        {
            headerErrors[i] = headerErrors[i].Replace("[0]", "", StringComparison.InvariantCulture);
        }

        return headerErrors;
    }

    private static bool LogError(ReadingExceptionOccurredArgs args, List<CsvValidationError> errors)
    {
        if (args.Exception is FieldValidationException exception && exception.Context != null && exception.Context.Reader != null && exception.Context.Parser != null)
        {
            CsvValidationError error = new CsvValidationError(exception.Field, exception.Context.Parser.Row, exception.Context.Reader.CurrentIndex + 1);
            errors.Add(error);
        }

        return false;
    }
}