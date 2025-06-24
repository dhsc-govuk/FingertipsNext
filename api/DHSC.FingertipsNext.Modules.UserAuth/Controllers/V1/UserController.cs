using System.Security.Authentication;
using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.UserAuth.Schemas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.UserAuth.Controllers.V1
{
    [ApiController]
    [Route("user")]
    [Authorize]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1822:Mark members as static", Justification = "<Pending>")]
    public class UserController(IAuthorizationService authService) : ControllerBase
    {
        [HttpGet]
        [Route("info")]
        public IActionResult UserInfo()
        {
            var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (nameClaim == null)
            {
                throw new AuthenticationException("User missing name claim.");
            }

            var currentUser = new UserInfo() { ExternalId = nameClaim.Value };

            return new OkObjectResult(currentUser);
        }

        [HttpHead]
        [Route("indicator/{indicatorId}")]
        public async Task<IActionResult> HasIndicatorPermission(string indicatorId)
        {
            var authResult = await authService.AuthorizeAsync(User, indicatorId, CanAdministerIndicatorRequirement.PolicyName);

            if (!authResult.Succeeded)
            {
                return new ForbidResult();
            }

            return new OkResult();
        }
    }
}
