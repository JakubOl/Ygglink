using Microsoft.AspNetCore.Identity;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults(typeof(Program).Assembly);

builder.AddSqlServerDbContext<IdentityDbContext>(connectionName: "IdentityDatabase");
builder.Services.AddMigration<IdentityDbContext, UsersSeed>();

builder.Services
    .AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<TokenGenerator, TokenGenerator>();

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.Run();
