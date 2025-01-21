using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

public class AreaDimensionModelHelper
{
    private readonly AreaDimensionModel _areaDimension =
        new AreaDimensionModel
        {
            AreaKey = 1,
            Code = "Code",
            Name = "name",
            StartDate = DateTime.Today,
            EndDate = DateTime.Today.AddDays(1)
        };

    public AreaDimensionModelHelper WithCode(string code)
    {
        _areaDimension.Code = code;
        return this;
    }

    public AreaDimensionModelHelper WithName(string name)
    {
        _areaDimension.Name = name;
        return this;
    }

    public AreaDimensionModel Build()
    {
        return _areaDimension;
    }
}