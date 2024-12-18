using Asp.Versioning;
using Microsoft.AspNetCore.Identity;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.AddSqlServerDbContext<IdentityDbContext>(connectionName: "IdentityDatabase");
builder.Services.AddMigration<IdentityDbContext, UsersSeed>();

builder.Services
    .AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<IdentityDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<TokenGenerator, TokenGenerator>();

builder.Services.AddEndpointsApiExplorer();

builder.AddDefaultOpenApi();
builder.Services.AddEndpoints();

var withApiVersioning = builder.Services.AddApiVersioning();
builder.AddDefaultOpenApi(withApiVersioning);

var app = builder.Build();

var apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new ApiVersion(1))
    .ReportApiVersions()
    .Build();

RouteGroupBuilder versionedGroup = app
    .MapGroup("api/v{version:apiVersion}")
    .WithApiVersionSet(apiVersionSet);

app.MapEndpoints(versionedGroup);

app.MapDefaultEndpoints();

app.UseRouting();
app.UseAuthorization();

app.Run();
