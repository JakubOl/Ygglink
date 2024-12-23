using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.TaskApi.Dtos;
using Ygglink.TaskApi.Infrastructure;

namespace Ygglink.TaskApi.Enpoints;

public class GetTasksEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("task",
            async ([FromQuery] string month,
            ILogger<GetTasksEndpoint> logger,
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
                        .Include(t => t.Subtasks)
                        .Where(t => t.UserId == userId && t.IsRecurring || t.Date >= start && t.Date < end)
                        .AsNoTracking()
                        .ToListAsync();

                    var expandedTasks = new List<TaskItemDto>();
                    foreach (var task in tasks)
                    {
                        if (task.IsRecurring)
                        {
                            for (int day = 1; day <= DateTime.DaysInMonth(start.Year, start.Month); day++)
                            {
                                var taskToAdd = task.MapToDto();
                                taskToAdd.Date = new DateTime(start.Year, start.Month, day);
                                expandedTasks.Add(taskToAdd);
                            }
                        }
                        else
                        {
                            expandedTasks.Add(task.MapToDto());
                        }
                    }

                    return Results.Ok(expandedTasks);
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
            });
    }
}
