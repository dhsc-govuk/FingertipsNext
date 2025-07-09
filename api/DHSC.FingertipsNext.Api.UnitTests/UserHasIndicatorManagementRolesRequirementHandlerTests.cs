using System.Security.Claims;
using DHSC.FingertipsNext.Api.Services;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Xunit.Sdk;

namespace DHSC.FingertipsNext.Api.UnitTests
{
    public class UserHasIndicatorManagementRolesRequirementHandlerTests
    {
        private readonly UserHasIndicatorManagementRolesRequirementHandler _authHandler;
        private readonly IHttpContextAccessor _mockContextAccessor;
        private readonly IIndicatorPermissionsLookupService _mockLookupService;

        public UserHasIndicatorManagementRolesRequirementHandlerTests()
        {
            _mockContextAccessor = Substitute.For<IHttpContextAccessor>();
            _mockLookupService = Substitute.For<IIndicatorPermissionsLookupService>();

            _mockContextAccessor.HttpContext = new DefaultHttpContext()
            {
                Request = { QueryString = new QueryString("") },
            };

            _authHandler = new UserHasIndicatorManagementRolesRequirementHandler(_mockLookupService, _mockContextAccessor);
        }

        public static IEnumerable<object?[]> AuthTestCasesData()
        {
            // ID in route parameter, array of IDs in query string, array of IDs user is permitted to see, expected result
            yield return [123, null, Array.Empty<int>(), false];

            // Indicator supplied in path
            yield return [123, null, Array.Empty<int>(), false]; // Path ID, user has no permissions
            yield return [123, null, new[] { 456 }, false]; // Path ID doesnt match users permissions
            yield return [123, null, new[] { 123 }, true]; // Path ID matches complete users permissions
            yield return [123, null, new[] { 123, 456 }, true]; //Path ID matches one of users permissions

            // Indicators in query Parameters
            yield return [null, new[] { 123 }, Array.Empty<int>(), false]; // Query ID, user has no permissions
            yield return [null, new[] { 123 }, new[] { 456 }, false]; //Query ID doesnt match users permissions
            yield return [null, new[] { 123, 456 }, new[] { 123 }, false]; // Query ID not completely matched by users permissions
            yield return [null, new[] { 123 }, new[] { 123 }, true]; // Query ID matches complete user permissions
            yield return [null, new[] { 123 }, new[] { 123, 456 }, true]; // Query ID matches one of users permissions
            yield return [null, new[] { 123, 456 }, new[] { 123, 456 }, true]; //Multiple Query IDs matched by all users permissions

            // Combined path and query parameters.
            yield return [123, new[] { 456 }, new[] { 456 }, false]; // Path ID doesnt match user permissions, Query ID does
            yield return [123, new[] { 456 }, new[] { 123 }, false]; // Path ID matches user permissions, Query ID does not
            yield return [123, new[] { 123 }, new[] { 123 }, true]; // Same Path ID and Query ID match user permissions
            yield return [123, new[] { 456 }, new[] { 123, 456 }, true]; // Path ID and Query ID different but match user permissions
            yield return [123, new[] { 456, 789 }, new[] { 123, 456, 789 }, true]; // Single Path ID, Multiple Query IDs match user permissions
        }

        [Theory]
        [MemberData(nameof(AuthTestCasesData))]
        public async Task AuthHandlerHandlesIdAndQueryParameters(int? routeParameter, int[]? queryParameters, int[] userPermissions, bool expectSuccess)
        {
            var roleId = new Guid("340580b2-e9f9-4ba9-99ab-610965d02c22");

            _mockLookupService.GetIndicatorsForRoles(Arg.Any<IEnumerable<Guid>>()).ReturnsForAnyArgs(userPermissions);

            _mockContextAccessor.HttpContext = BuildHttpContext(queryParameters, routeParameter);
            var authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(roleId.ToString()), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBe(expectSuccess);
        }

        [Fact]
        public async Task AuthHandlerReturnsFalseIfUserLacksRoleClaim()
        {
            _mockLookupService.GetIndicatorsForRoles(Arg.Any<IEnumerable<Guid>>()).Throws(new XunitException("Should not be called"));

            _mockContextAccessor.HttpContext = BuildHttpContext(indicatorIdInPath: 1);

            var authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBe(false);
        }

        [Fact]
        public async Task AuthHandlerThrowsExceptionIfRequestContextDoesntContainIndicatorId()
        {
            var roleId = new Guid("340580b2-e9f9-4ba9-99ab-610965d02c22");

            _mockLookupService.GetIndicatorsForRoles([]).ReturnsForAnyArgs([123]);

            _mockContextAccessor.HttpContext = BuildHttpContext();
            var authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal(roleId.ToString()), null);

            await Should.ThrowAsync<InvalidOperationException>(() => _authHandler.HandleAsync(authContext));
        }

        [Fact]
        public async Task AuthHandlerDoesntCrashIfRolesContainInvalidRoleGuid()
        {
            _mockLookupService.GetIndicatorsForRoles([]).ReturnsForAnyArgs([123]);

            _mockContextAccessor.HttpContext = BuildHttpContext(indicatorIdInPath: 123);
            var authContext = new AuthorizationHandlerContext([new CanAdministerIndicatorRequirement()],
                GenerateClaimsPrincipal("Not a guid"), null);

            await _authHandler.HandleAsync(authContext);

            authContext.HasSucceeded.ShouldBe(false);
        }


        private static DefaultHttpContext BuildHttpContext(int[]? indicatorIdsInQueryString = null, int? indicatorIdInPath = null)
        {
            var dictionary = new RouteValueDictionary();

            if (indicatorIdInPath != null)
            {
                dictionary.Add(UserHasIndicatorManagementRolesRequirementHandler.IndicatorIdParameterName, indicatorIdInPath.ToString());
            }

            var queryString = new QueryString();

            if (indicatorIdsInQueryString != null)
            {
                queryString = queryString.Add(UserHasIndicatorManagementRolesRequirementHandler.IndicatorIdCollectionParameterName, string.Join(",", indicatorIdsInQueryString));
            }

            return new DefaultHttpContext()
            {
                Request =
                {
                    RouteValues = dictionary,
                    QueryString = queryString
                },
            };
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
