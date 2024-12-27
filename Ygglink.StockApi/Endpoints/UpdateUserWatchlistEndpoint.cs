using FluentValidation;
using System.Security.Claims;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.StockApi.Infrastructure;
using Ygglink.StockApi.Model;
using Ygglink.ServiceDefaults.Extensions;

namespace Ygglink.StockApi.Endpoints;

public class UpdateUserWatchlistEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("userwatchlist",
                async (UserWatchlistDto userWatchlistDto,
                ClaimsPrincipal user,
                IUserWatchlistRepository userWatchlistRepository) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    UserWatchlist userWatchlist = new()
                    {
                        UserId = userId.ToString(),
                        Stocks = userWatchlistDto.Stocks,
                    };
                    await userWatchlistRepository.UpdateAsync(userWatchlist);

                    return Results.Created($"/userwatchlist", userWatchlist.MapToDto());
                })
            .Accepts<UserWatchlist>("application/json")
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("UpdateUserWatchlist")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Update User Watchlist Endpoint";
                operation.Description = "Updates user watchlist.";
                return operation;
            })
            .RequireAuthorization();
    }
}
