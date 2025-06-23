using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.UserAuth.Controllers.V1
{
    [ApiController]
    [Route("user")]
    [Authorize]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1822:Mark members as static", Justification = "<Pending>")]
    public class UserController : ControllerBase
    {
        private readonly IAuthorizationService _authService;

        public UserController(IAuthorizationService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        [Route("info")]
        public IActionResult UserInfo()
        {
            var userSub = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            return new OkObjectResult(userSub?.Value ?? "Sub Undefined");
        }

        [HttpGet]
        [Route("indicator/{indicatorId}")]
        public async Task<IActionResult> GetIndicator(string indicatorId)
        {
            var authResult = await _authService.AuthorizeAsync(User, indicatorId, CanAdministerIndicatorRequirement.PolicyName);

            if (!authResult.Succeeded)
            {
                return new ForbidResult();
            }

            return new OkObjectResult("Is Authenticated");
        }
    }
}
