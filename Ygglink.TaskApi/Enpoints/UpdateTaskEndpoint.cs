using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Dtos;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class UpdateTaskEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("task",
                async (TaskDbContext context,
                ClaimsPrincipal user,
                TaskItemDto taskDto) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    if (taskDto == null)
                        return Results.BadRequest(new { message = "Task data is required." });

                    var task = await context.Tasks
                       .Include(t => t.Subtasks)
                       .FirstOrDefaultAsync(t => t.UserId == userId && t.Guid == taskDto.Guid);

                    if (task == null)
                        return Results.NotFound(new { message = "Task does not exist!" });

                    task = taskDto.MapToEntity();
                    task.UserId = userId;

                    await context.SaveChangesAsync();

                    return Results.Created($"/tasks/{task.Id}", task);
                })
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status404NotFound)
            .WithName("UpdateTask")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Update Task Endpoint";
                operation.Description = "Updates task and subtasks.";
                return operation;
            })
            .RequireAuthorization();
    }
}
