namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvValidationResult
{
    public CsvValidationResult(bool success, IList<CsvValidationError> errors)
    {
        Success = success;
        Errors = errors;
    }

    public bool Success { get; }
    public IList<CsvValidationError> Errors { get; }
}