using System.Security.Claims;
using DHSC.FingertipsNext.Modules.UserAuth.Controllers.V1;
using DHSC.FingertipsNext.Modules.UserAuth.Schemas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.UserAuth.UnitTests.Controllers
{
    public class UserControllerTests
    {
        private UserController _controller;

        public UserControllerTests()
        {
            _controller = new UserController();
        }

        [Fact]
        public void UserIdCanBeExtractedFromClaimsAndReturnedToCaller()
        {
            string externalId = "12345_ABCDE";

            _controller.ControllerContext = BuildControllerContext(externalId);

            var response = _controller.UserInfo() as ObjectResult;
            var responseObject = response.Value as UserInfo;

            response.StatusCode.ShouldBe(200);
            responseObject?.ShouldNotBeNull();
            responseObject.ExternalId.ShouldBe(externalId);
        }

        [Fact]
        public void IndicatorPermissionEndpointReturns200()
        {
            var response = _controller.HasIndicatorPermission("123") as IStatusCodeActionResult;

            response.StatusCode.ShouldBe(200);
        }

        private static ControllerContext BuildControllerContext(string withExternalId)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, withExternalId)
            };
            var identity = new ClaimsIdentity(claims, "TestAuth");
            var user = new ClaimsPrincipal(identity);

            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = user
                }
            };

            return context;
        }
    }
}
