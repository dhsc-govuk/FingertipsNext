using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.UserAuth.Repository;

public class UserAuthLookupRepository(UserAuthDbContext dbContext) : IIndicatorPermissionsLookupService
{
    public async Task<IEnumerable<int>> GetIndicatorsForRoles(IEnumerable<Guid> roleIds)
    {
        var indicatorRoles = await dbContext.IndicatorRoles.Include(ir => ir.Indicator).Where(ir => roleIds.Contains(ir.RoleId)).ToListAsync();

        return indicatorRoles.Select(ir => ir.Indicator.IndicatorId);
    }
}