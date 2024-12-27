using FluentValidation;
using System.Security.Claims;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.StockApi.Infrastructure;
using Ygglink.StockApi.Model;
using Ygglink.ServiceDefaults.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Ygglink.StockApi.Endpoints;

public class UpdateUserWatchlistEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("userwatchlist",
                async (
                UserWatchlist userWatchlist,
                ClaimsPrincipal user,
                    [FromServices] IUserWatchlistRepository userWatchlistRepository,
                IValidator<UserWatchlist> validator) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    var validationResult = validator.Validate(userWatchlist);
                    if (!validationResult.IsValid)
                        return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

                    await userWatchlistRepository.UpdateAsync(userWatchlist);

                    return Results.Created($"/userwatchlist/{userWatchlist.UserId}", userWatchlist);
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
