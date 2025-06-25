using System.Security.Claims;
using DHSC.FingertipsNext.Api.Services;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Api.UnitTests
{
    public class ShouldBeAnAdministratorRequirementHandlerTests
    {
        private ShouldBeAnAdministratorRequirementHandler _authHandler;
        private IConfiguration _mockConfig;

        public ShouldBeAnAdministratorRequirementHandlerTests()
        {
            _mockConfig = Substitute.For<IConfiguration>();

            _authHandler = new ShouldBeAnAdministratorRequirementHandler(_mockConfig);
        }

        [Fact]
        public async Task AuthHandlerReturnsUnauthorizedWhenAdminRoleUndefined()
        {
            var indicatorId = "123";

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                buildClaimsPrincipal(),
                indicatorId);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeFalse();
        }

        [Fact]
        public async Task AuthHandlerReturnsUnauthorizedWhenUserLacksAdminRole()
        {
            string adminRoleId = "8c3441bf-a2a6-415a-be6e-5467c9237671";
            _mockConfig["AdminRole"].Returns(adminRoleId);

            var indicatorId = "123";

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                buildClaimsPrincipal(),
                indicatorId);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeFalse();
        }

        [Fact]
        public async Task AuthHandlerReturnsAuthorizedWhenHasAdminRole()
        {
            string adminRoleId = "8c3441bf-a2a6-415a-be6e-5467c9237671";
            _mockConfig["AdminRole"].Returns(adminRoleId);

            var indicatorId = "123";

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                buildClaimsPrincipal(adminRoleId),
                indicatorId);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeTrue();
        }


        private static ClaimsPrincipal buildClaimsPrincipal(string roleToAdd = "")
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Role, roleToAdd)
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var user = new ClaimsPrincipal(identity);


            return user;
        }
    }
}
