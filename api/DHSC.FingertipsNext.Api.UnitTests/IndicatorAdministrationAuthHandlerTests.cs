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

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeFalse();
        }

        [Fact]
        public async Task AuthHandlerReturnsUnauthorizedWhenUserLacksAdminRole()
        {
            _mockConfig["AdminRole"].Returns("8c3441bf-a2a6-415a-be6e-5467c9237671");

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeFalse();
        }

        [Fact]
        public async Task AuthHandlerReturnsAuthorizedWhenHasAdminRole()
        {
            string adminRoleId = "8c3441bf-a2a6-415a-be6e-5467c9237671";
            _mockConfig["AdminRole"].Returns(adminRoleId);

            AuthorizationHandlerContext authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(adminRoleId), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBeTrue();
        }


        private static ClaimsPrincipal GenerateClaimsPrincipal(string? roleToAdd = null)
        {
            var claims = new List<Claim>();

            if (roleToAdd != null)
            {
                claims.Add(new Claim(ClaimTypes.Role, roleToAdd));
            }

            var identity = new ClaimsIdentity(claims, "TestAuth");
            var user = new ClaimsPrincipal(identity);

            return user;
        }
    }
}
