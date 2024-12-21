using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class GetTaskItemEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("task/{taskGuid}",
            async (Guid taskGuid,
            ILogger<GetTasksEndpoint> logger,
            TaskDbContext context,
            ClaimsPrincipal user) =>
            {
                var userId = user.GetUserGuid();
                if (userId == Guid.Empty)
                    return Results.Problem(statusCode: 401);

                var task = await context.Tasks
                    .Include(t => t.Subtasks)
                    .FirstOrDefaultAsync(t => t.UserId == userId && t.Guid == taskGuid);

                if (task == null)
                    return Results.NotFound(new { message = "Task does not exist!" });

                return Results.Ok(task.MapToDto());
            })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("Task")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Task Endpoint";
                operation.Description = "Returns task with subtasks.";
                return operation;
            })
            .RequireAuthorization();
    }
}
