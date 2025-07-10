namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public enum ResponseStatus
{
    Unknown = 0,
    Success = 1,
    NoDataForIndicator = 2,
    IndicatorDoesNotExist = 3,
    BatchNotFound = 4,
    ErrorDeletingPublishedBatch = 5
}