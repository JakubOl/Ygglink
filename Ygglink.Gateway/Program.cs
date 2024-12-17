using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services
    .AddAuthorization(options =>
    {
        options.AddPolicy("RequireUserRole", policy => policy.RequireRole("user"));
    });

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("rateLimitingPolicy", opt =>
    {
        opt.PermitLimit = 4;
        opt.Window = TimeSpan.FromSeconds(12);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 2;
    });

    options.AddPolicy("fixed-by-ip", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            httpContext.Request.Headers["X-Forwarder-For"].ToString(),
            //partitionKey: httpContext.Connection.RemoteIpAddress?.ToString(),
            // partitionKey: httpContext.User.Identity?.Name?.ToString(),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1)
            }));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("frontCorsPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddOutputCache(options =>
{
    options.AddPolicy("outputCachePolicy", builder => builder.Expire(TimeSpan.FromSeconds(20)));
});

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