using Hangfire;
using Hangfire.SqlServer;
using Ygglink.ServiceDefaults.Extensions;
using Ygglink.Worker.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services
    .AddHangfire(x =>
    {
        x.UseSimpleAssemblyNameTypeSerializer()
         .UseRecommendedSerializerSettings()
         .UseSqlServerStorage("Server=sqlserver;Database=Hangfire;User=sa;Password=Your_password123;Encrypt=False;",
             new SqlServerStorageOptions
             {
                 CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                 SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                 QueuePollInterval = TimeSpan.Zero,
                 UseRecommendedIsolationLevel = true
             });
    });

//builder.Services.AddTransient<IUpdateStocksDataService, UpdateStocksDataService>();
builder.Services.AddHangfireServer();
builder.Services.AddHostedService<JobsRegistrar>();

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseHttpsRedirection();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = [new HangfireDashboardAuthorizationFilter()]
});

app.Run();




