using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.UserAuth.Repository;

public class UserAuthLookupService(UserAuthDbContext dbContext) : IIndicatorPermssionsLookupService
{
    public async Task<IEnumerable<int>> GetIndicatorsForRoles(IEnumerable<Guid> roleIds)
    {
        return await dbContext.IndicatorRoles.Where(ir => roleIds.Contains(ir.RoleId)).Select(ir => (int)ir.Indicator.IndicatorId).ToListAsync();
    }
}