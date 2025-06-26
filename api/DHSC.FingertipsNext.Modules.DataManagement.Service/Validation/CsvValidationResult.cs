using System.Collections.ObjectModel;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

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