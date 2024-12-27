using Ygglink.ServiceDefaults.Extensions;
using Ygglink.StockApi.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults(typeof(Program).Assembly);
builder.AddMongoDBClient(connectionName: "mongodb");

builder.Services.AddSingleton<IUserWatchlistRepository, UserWatchlistRepository>();

var app = builder.Build();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.Run();
