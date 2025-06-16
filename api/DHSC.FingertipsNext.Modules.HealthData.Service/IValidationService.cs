namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IValidationService
{
    bool IsValid(Stream input);
}