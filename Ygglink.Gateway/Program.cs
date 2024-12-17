using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Ygglink.ServiceDefaults.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();



var app = builder.Build();

app.MapDefaultEndpoints();
app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseOutputCache();

app.UseCors("frontCorsPolicy");
app.UseRateLimiter();

app.MapReverseProxy();

app.Run();
