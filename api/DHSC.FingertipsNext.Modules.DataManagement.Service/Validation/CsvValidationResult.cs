namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvValidationResult
{
    public CsvValidationResult(bool success, IList<CsvError> errors)
    {
        Success = success;
        Errors = errors;
    }

    public bool Success { get; }
    public IList<CsvError> Errors { get; }
}