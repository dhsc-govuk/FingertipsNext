using System.Security.Claims;
using System.Web;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Api.Services;

internal sealed class UserHasIndicatorManagementRolesRequirementHandler(IIndicatorPermssionsLookupService lookupService, IHttpContextAccessor contextAccessor) : AuthorizationHandler<CanAdministerIndicatorRequirement>
{
    public const string IndicatorIdParameterName = "indicatorId";
    public const string IndicatorIdCollectionParameterName = "indicator_ids";

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, CanAdministerIndicatorRequirement requirement)
    {
        if (contextAccessor.HttpContext == null)
        {
            throw new InvalidOperationException("Cannot handle requirement without a valid http context.");
        }

        List<int> routeIndicators = new List<int>();

        if (TryGetIndicatorFromRoute(contextAccessor.HttpContext.GetRouteData(), out var indicator))
        {
            routeIndicators.Add(indicator);
        }

        if (TryGetIndicatorsFromQueryString(contextAccessor.HttpContext.Request.QueryString, out var indicators))
        {
            routeIndicators.AddRange(indicators);
        }

        if (routeIndicators.Count == 0)
        {
            throw new InvalidOperationException("Indicator management policy applied to a route that does not contain a valid indicator id route or query parameter.");
        }

        var userRoles = context.User.FindAll(ClaimTypes.Role).Select(c => Guid.Parse(c.Value)).ToArray();

        if (userRoles.Length == 0)
        {
            return;
        }

        var userIndicatorPermissions = await lookupService.GetIndicatorsForRoles(userRoles);

        if (routeIndicators.All(id => userIndicatorPermissions.Contains(id)))
        {
            context.Succeed(requirement);
        }
    }

    private static bool TryGetIndicatorFromRoute(RouteData route, out int indicator)
    {
        if (route.Values[IndicatorIdParameterName] is string param && int.TryParse(param, out indicator))
        {
            return true;
        }

        indicator = 0;
        return false;
    }

    private static bool TryGetIndicatorsFromQueryString(QueryString query, out IList<int> indicators)
    {
        indicators = new List<int>();

        if (query.Value == null)
            return false;

        var collection = HttpUtility.ParseQueryString(query.Value);

        var values = collection.GetValues(IndicatorIdCollectionParameterName);

        if (values == null)
        {
            return false;
        }

        foreach (var queryParam in values)
        {
            var elements = queryParam.Split(",");
            foreach (var elem in elements)
            {
                if (int.TryParse(elem, out var id))
                {
                    indicators.Add(id);
                }
            }
        }

        return true;

    }
}