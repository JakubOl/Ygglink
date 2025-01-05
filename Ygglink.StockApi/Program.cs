using Ygglink.ServiceDefaults.Extensions;
using Ygglink.StockApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults(typeof(Program).Assembly);
builder.AddMongoDBClient(connectionName: "mongodb");

builder.AddSqlServerDbContext<StockDbContext>(connectionName: "StockDatabase");
builder.Services.AddMigration<StockDbContext>((_, _) => Task.CompletedTask);

builder.Services.AddSingleton<IUserWatchlistRepository, UserWatchlistRepository>();
builder.Services.AddSingleton<IAlphaVantageService, AlphaVantageService>();

var app = builder.Build();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.Run();
