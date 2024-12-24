using Ygglink.ServiceDefaults.Extensions;
using Ygglink.TaskApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults(typeof(Program).Assembly);

builder.AddSqlServerDbContext<TaskDbContext>(connectionName: "TaskDatabase");
builder.Services.AddMigration<TaskDbContext>((_, _) => Task.CompletedTask);

var app = builder.Build();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.Run();

