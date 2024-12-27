using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class GetTasksEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("task",
                async ([FromQuery] string month,
                TaskDbContext context,
                ClaimsPrincipal user) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Problem("User not authorized", statusCode: 401);

                    if (!DateTime.TryParse(month + "-01", out DateTime parsedMonth))
                        return Results.BadRequest(new { message = "Invalid month format. Use YYYY-MM." });

                    var start = new DateTime(parsedMonth.Year, parsedMonth.Month, 1);
                    var end = start.AddMonths(1);

                    var tasks = await context.Tasks
                        .Where(t => t.UserId == userId && t.StartDate <= end && t.EndDate >= start)
                        .Select(x => x.MapToDto())
                        .AsNoTracking()
                        .ToListAsync();

                    return Results.Ok(tasks);
                })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("Tasks")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Tasks Endpoint";
                operation.Description = "Returns tasks with subtasks in current month.";
                return operation;
            })
            .RequireAuthorization();
    }
}
