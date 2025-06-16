using System.Diagnostics.CodeAnalysis;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IValidationService
{
    bool IsValid([NotNull] Stream input);
}