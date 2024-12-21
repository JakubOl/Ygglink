using System.Security.Claims;

namespace Ygglink.ServiceDefaults.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal principal)
        => principal.FindFirst("sub")?.Value;

    public static Guid GetUserGuid(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirst("sub");

        if(sub == null || !Guid.TryParse(sub.Value, out var userGuid))
            return Guid.Empty;

        return userGuid;
    }

    public static string GetUserName(this ClaimsPrincipal principal) =>
        principal.FindFirst(x => x.Type == ClaimTypes.Name)?.Value;
}
