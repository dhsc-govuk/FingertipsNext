using DHSC.FingertipsNext.Modules.DataManagement.Schemas;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Models;

public class UploadHealthDataResponse(OutcomeType errorType, Batch? model = null, ICollection<string>? errors = null)
{
    public OutcomeType Outcome { get; } = errorType;
    public Batch? Model { get; } = model;
    public ICollection<string>? Errors { get; } = errors;
}

public enum OutcomeType
{
    Ok,
    ServerError,
    ClientError,
    PermissionDenied,
    NotFound
}