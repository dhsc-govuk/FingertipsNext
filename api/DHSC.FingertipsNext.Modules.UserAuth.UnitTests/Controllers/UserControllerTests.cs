using System.Security.Claims;
using DHSC.FingertipsNext.Modules.UserAuth.Controllers.V1;
using DHSC.FingertipsNext.Modules.UserAuth.Schemas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.UserAuth.UnitTests.Controllers
{
    public class UserControllerTests
    {
        private IAuthorizationService _mockAuthService;
        private UserController _controller;

        public UserControllerTests()
        {
            _mockAuthService = Substitute.For<IAuthorizationService>();

            _controller = new UserController(_mockAuthService);
        }

        [Fact]
        public void UserIdExtractedFromClaims()
        {
            string externalId = "12345_ABCDE";

            _mockAuthService.AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<Object>(), Arg.Any<IEnumerable<IAuthorizationRequirement>>())
                .Returns(AuthorizationResult.Success());
            _controller.ControllerContext = BuildControllerContext(externalId);

            var response = _controller.UserInfo() as ObjectResult;
            var responseObject = response.Value as UserInfo;

            response?.StatusCode.ShouldBe(200);

            responseObject?.ShouldNotBeNull();
            responseObject.ExternalId.ShouldBe(externalId);
        }

        [Fact]
        public async Task Http200ReturnedWhenAuthenticatedUserMatchesAuthorizationRequirement()
        {
            _mockAuthService.AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<Object>(), Arg.Any<string>())
                .ReturnsForAnyArgs(AuthorizationResult.Success());

            var response = await _controller.HasIndicatorPermission("123") as ObjectResult;

            response?.StatusCode.ShouldBe(200);
        }

        [Fact]
        public async Task Http403ReturnedWhenAuthenticatedUserFailsAuthorizationRequirement()
        {
            _mockAuthService.AuthorizeAsync(Arg.Any<ClaimsPrincipal>(), Arg.Any<Object>(), Arg.Any<string>())
                .ReturnsForAnyArgs(AuthorizationResult.Failed());

            var response = await _controller.HasIndicatorPermission("123") as ObjectResult;

            response?.StatusCode.ShouldBe(403);
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
