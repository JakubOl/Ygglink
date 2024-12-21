using Microsoft.EntityFrameworkCore;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Infrastructure;

public class TaskDbContext(DbContextOptions<TaskDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<Subtask> Subtasks { get; set; }
}
