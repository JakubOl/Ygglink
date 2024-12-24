using Ygglink.Gateway;
using Ygglink.ServiceDefaults.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults(typeof(Program).Assembly);
builder.AddServices();

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