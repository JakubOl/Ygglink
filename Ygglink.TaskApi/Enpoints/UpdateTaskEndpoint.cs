using System.Security.Claims;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Infrastructure;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Enpoints;

public class UpdateTaskEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut("task",
                async (TaskDbContext context,
                ClaimsPrincipal user,
                TaskItemDto taskDto,
                IValidator<TaskItemDto> validator) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    var validationResult = validator.Validate(taskDto);
                    if (!validationResult.IsValid)
                        return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

                    var task = await context.Tasks
                       .FirstOrDefaultAsync(t => t.UserId == userId && t.Guid == taskDto.Guid);

                    if (task == null)
                        return Results.NotFound(new { message = "Task does not exist!" });

                    task.Title = taskDto.Title;
                    task.StartDate = taskDto.StartDate;
                    task.EndDate = taskDto.EndDate;
                    task.Priority = taskDto.Priority;

                    await context.SaveChangesAsync();

                    return Results.Created($"/tasks/{task.Id}", task);
                })
            .Accepts<TaskItemDto>("application/json")
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
