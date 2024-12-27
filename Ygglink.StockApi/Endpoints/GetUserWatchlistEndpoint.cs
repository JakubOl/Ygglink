using System.Security.Claims;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.StockApi.Infrastructure;
using Ygglink.ServiceDefaults.Extensions;

namespace Ygglink.StockApi.Endpoints;

public class GetUserWatchlistEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("userwatchlist",
                async (ClaimsPrincipal user,
                IUserWatchlistRepository userWatchlistRepository) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Problem("User not authorized", statusCode: 401);

                    var userWatchlist = await userWatchlistRepository.GetAsync(userId.ToString());

                    return Results.Ok(userWatchlist.MapToDto());
                })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("UserWatchlist")
            .WithOpenApi(operation =>
            {
                operation.Summary = "UserWatchlist Endpoint";
                operation.Description = "Returns user watchlist.";
                return operation;
            })
            .RequireAuthorization();
    }
}
