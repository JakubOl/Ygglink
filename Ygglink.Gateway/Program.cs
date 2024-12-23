using Asp.Versioning;
using Ygglink.Gateway;
using Ygglink.ServiceDefaults.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddServices();
builder.Services.AddEndpointsApiExplorer();

var withApiVersioning = builder.Services.AddApiVersioning();
builder.AddDefaultOpenApi(withApiVersioning);

var app = builder.Build();

app.MapDefaultEndpoints();

app.UseAuthentication();
app.UseAuthorization();

//app.UseOutputCache();

app.UseCors("frontCorsPolicy");
//app.UseRateLimiter();

app.MapReverseProxy();
app.MapDefaultEndpoints();
app.UseDefaultOpenApi();

app.Run();