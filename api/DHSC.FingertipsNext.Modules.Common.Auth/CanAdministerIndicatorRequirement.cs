using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Modules.Common.Auth
{
    public class CanAdministerIndicatorRequirement : IAuthorizationRequirement
    {
        public const string Policy = "AdministerIndicatorPolicy";
    }
}
