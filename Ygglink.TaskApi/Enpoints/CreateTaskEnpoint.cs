using System.Security.Claims;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Enpoints.Dtos;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class CreateTaskEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("task", 
                async (TaskDbContext context, 
                ClaimsPrincipal user, 
                TaskItemDto taskDto) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    if (taskDto == null)
                        return Results.BadRequest(new { message = "Task data is required." });

                    var task = taskDto.MapToEntity();
                    task.UserId = userId;

                    context.Tasks.Add(task);
                    await context.SaveChangesAsync();

                    return Results.Created($"/tasks/{task.Id}", task);
                })
            .Produces(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("CreateTask")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Create Task Endpoint";
                operation.Description = "Creates task and subtasks.";
                return operation;
            })
            .RequireAuthorization();
    }
}
