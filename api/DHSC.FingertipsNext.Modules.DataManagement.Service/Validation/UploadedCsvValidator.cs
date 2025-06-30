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
    public static CsvValidationResult Validate(Stream? stream)
    {
        var errors = new List<CsvValidationError>();
        if (stream != null)
        {
            if (stream.Length == 0)
            {
                CsvValidationError emptyError = new CsvValidationError("File is empty", 1, 1, true);
                return new CsvValidationResult(false, new List<CsvValidationError>() { emptyError });
            }

            var csvReaderConfiguration = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                ReadingExceptionOccurred = (args) => LogError(args, errors)
            };

            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, csvReaderConfiguration);
            csv.Context.RegisterClassMap<UploadedIndicatorDataRowMap>();
            var records = csv.GetRecords<UploadedIndicatorDataRow>();

            try
            {
                var count = 0;
                // Do not call .ToList() on records, as this will bring the entire CSV structure into memory
                foreach (UploadedIndicatorDataRow row in records)
                {
                    // Need the foreach to trigger the validation
                    // TryGetNonEnumeratedCount doesn't appear to work, so will have to manually increment the count
                    count++;
                }

                if (count == 0)
                {
                    CsvValidationError error = new CsvValidationError($"No records found", 1, 1, true);
                    return new CsvValidationResult(false, new List<CsvValidationError>() { error });
                }

                if (!ValidateHeaders(csv, out var unexpectedHeaders))
                {
                    CsvValidationError error = new CsvValidationError($"Unexpected header(s) found: {string.Join(", ", unexpectedHeaders)}", 1, 1, true);
                    return new CsvValidationResult(false, new List<CsvValidationError>() { error });
                }
            }
            catch (HeaderValidationException ex)
            {
                foreach (var headerError in FormatHeaderErrors(ex.Message))
                {
                    CsvValidationError error = new CsvValidationError(headerError, 1, 1, true);
                    errors.Add(error);
                }
            }
        }
        else
        {
            errors.Add(new CsvValidationError("An error occurred when reading the file", 1, 1, true));
        }

        return errors.Count != 0 ? new CsvValidationResult(false, new Collection<CsvValidationError>(errors)) : new CsvValidationResult(true, new Collection<CsvValidationError>());
    }

    private static bool ValidateHeaders(CsvReader csv, out List<string> unexpectedHeaders)
    {
        var headers = (csv.HeaderRecord ?? []).ToList();
        var validHeaderList = UploadedIndicatorDataRow.GetHeaders();
        unexpectedHeaders = [];
        if (!headers.SequenceEqual(validHeaderList))
        {
            unexpectedHeaders = (headers ?? []).Except(validHeaderList).ToList();
            return false;
        }

        return true;
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
            CsvValidationError error = new CsvValidationError(exception.Field, exception.Context.Parser.Row, exception.Context.Reader.CurrentIndex + 1, false);
            errors.Add(error);
        }

        return false;
    }
}