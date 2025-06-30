using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.UserAuth.Schemas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.UserAuth.Controllers.V1
{
    [ApiController]
    [Route("user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        [HttpGet]
        [Route("info")]
        public IActionResult UserInfo()
        {
            var nameClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (nameClaim == null)
            {
                return new BadRequestObjectResult(new SimpleError() { Message = $"Missing {ClaimTypes.NameIdentifier} claim." });
            }

            var currentUser = new UserInfo() { ExternalId = nameClaim.Value };

            return new OkObjectResult(currentUser);
        }

        [HttpHead]
        [Route("indicator/{indicatorId}")]
        [Authorize(Policy = CanAdministerIndicatorRequirement.Policy)]
        public IActionResult HasIndicatorPermission(string indicatorId) => new OkResult();
    }
}
