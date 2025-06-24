using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Modules.Common.Auth
{
    /// <summary>
    /// This policy determines whether a user is able to administer a specific indicator.
    /// The policy must be evaluated via an inline method call to AuthorizeAsync in order to evaluate the indicator ID.
    /// </summary>
    public class CanAdministerIndicatorRequirement : IAuthorizationRequirement
    {
        public const string Policy = "AdministerIndicatorPolicy";
    }
}
