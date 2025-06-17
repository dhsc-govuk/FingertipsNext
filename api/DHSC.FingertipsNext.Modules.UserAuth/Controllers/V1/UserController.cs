using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.User.Controllers.V1
{
    [ApiController]
    //[Authorize]
    [Route("user")]
    public class UserController : ControllerBase
    {
        /// <summary>
        /// Get all available hierarchy types
        /// </summary>
        /// <returns>The available hierarchy types, e.g. NHS or Administrative</returns>
        [HttpGet]
        [Route("info")]
        [ProducesResponseType(null, StatusCodes.Status200OK)]
        public static IActionResult UserInfo()
        {
            return new OkResult();
        }

    }
}
