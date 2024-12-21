using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class DeleteTaskEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("task/{taskGuid}",
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

                if (task.Subtasks != null)
                    context.Subtasks.RemoveRange(task.Subtasks);

                context.Tasks.Remove(task);

                await context.SaveChangesAsync();

                return Results.NoContent();
            })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("DeleteTask")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Delete Task Endpoint";
                operation.Description = "Deletes task and subtasks.";
                return operation;
            })
            .RequireAuthorization();
    }
}
