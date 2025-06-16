namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class CsvValidationService : IValidationService
{
    public bool IsValid(Stream input)
    {
        return input is { Length: > 0 };
    }
}