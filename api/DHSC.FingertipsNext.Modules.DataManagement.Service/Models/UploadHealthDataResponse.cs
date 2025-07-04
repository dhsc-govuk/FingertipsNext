namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Models;

public class UploadHealthDataResponse(OutcomeType errorType, ICollection<string>? errors = null)
{
    public OutcomeType Outcome { get; } = errorType;
    public ICollection<string>? Errors { get; } = errors;
}

public enum OutcomeType
{
    Ok,
    ServerError
}