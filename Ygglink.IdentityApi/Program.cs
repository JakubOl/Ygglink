using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddSqlServerDbContext<IdentityDbContext>(connectionName: "IdentityDatabase");
builder.Services.AddMigration<IdentityDbContext, UsersSeed>();

builder.Services.AddControllers();

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapDefaultControllerRoute();

app.Run();
