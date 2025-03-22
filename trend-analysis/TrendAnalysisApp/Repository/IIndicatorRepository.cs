using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public interface IIndicatorRepository
{
    public Task<IEnumerable<IndicatorDimensionModel>> GetAll();
}
