using System.Security.Claims;
using FluentValidation;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Infrastructure;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Enpoints;

public class CreateTasksEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("task", 
                async (TaskDbContext context, 
                ClaimsPrincipal user, 
                TaskItemDto[] taskDtos,
                IValidator<TaskItemDto> validator) =>
                {
                    var userId = user.GetUserGuid();
                    if (userId == Guid.Empty)
                        return Results.Unauthorized();

                    var tasksToAdd = new List<TaskItem>();
                    foreach (var taskDto in taskDtos)
                    {
                        var validationResult = validator.Validate(taskDto);
                        if (!validationResult.IsValid)
                            return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

                        var taskEntity = taskDto.MapToEntity();
                        taskEntity.UserId = userId;

                        tasksToAdd.Add(taskEntity);
                    }

                    context.Tasks.AddRange(tasksToAdd);
                    await context.SaveChangesAsync();

                    return Results.Created($"/tasks", taskDtos);
                })
            .Accepts<TaskItemDto>("application/json")
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
