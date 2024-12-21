using FluentValidation;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.TaskApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddSqlServerDbContext<TaskDbContext>(connectionName: "TaskDatabase");
builder.Services.AddMigration<TaskDbContext>((_, _) => Task.CompletedTask);

builder.Services.AddEndpoints(typeof(Program));
builder.Services.AddEndpointsApiExplorer();

var withApiVersioning = builder.Services.AddApiVersioning();
builder.AddDefaultOpenApi(withApiVersioning);

builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.UseHttpsRedirection();

app.Run();

