using System.Linq.Expressions;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public static class HealthDataPredicates
{
    private const string ENGLAND_AREA_CODE = "E92000001";

    public static Expression<Func<HealthMeasureModel, bool>> IsInAreaCodes(string[] areaCodes)
    {
        return healthMeasure => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(healthMeasure.AreaDimension.Code);
    }

    /// <summary>
    /// Checks that when multiple areas are requested - i.e. more than one area code or no area codes (so everything) -
    /// that the given area code is not the one for England.
    /// </summary>
    public static Expression<Func<HealthMeasureModel, bool>> IsNotEnglandWhenMultipleRequested(string[] areaCodes)
    {
        return healthMeasure => areaCodes.Length == 1 || healthMeasure.AreaDimension.Code != ENGLAND_AREA_CODE;
    }
}
