using Microsoft.AspNetCore.Identity;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddSqlServerDbContext<IdentityDbContext>(connectionName: "IdentityDatabase");
builder.Services.AddMigration<IdentityDbContext, UsersSeed>();

builder.Services
    .AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddControllers();

builder.Services.AddSingleton<TokenGenerator, TokenGenerator>();

var withApiVersioning = builder.Services.AddApiVersioning();

builder.AddDefaultOpenApi(withApiVersioning);

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapDefaultEndpoints();

app.Run();
