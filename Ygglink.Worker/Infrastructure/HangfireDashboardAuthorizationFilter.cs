using Hangfire.Dashboard;

namespace Ygglink.Worker.Infrastructure;

public class HangfireDashboardAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        //var httpContext = context.GetHttpContext();
        //return httpContext.User.Identity.IsAuthenticated;

        return true;
    }
}
