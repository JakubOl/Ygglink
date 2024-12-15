using Hangfire;

namespace Ygglink.Worker.Infrastructure;

public class JobsRegistrar : IHostedService
{
    public Task StartAsync(CancellationToken cancellationToken)
    {
        //BackgroundJob.Schedule<IUpdateStocksDataService>((updateStocksDataService) => updateStocksDataService.UpdateData(DateTime.Now), TimeSpan.FromMinutes(1));

        //var jobId = BackgroundJob.Enqueue(() => Console.WriteLine("Parent job executed"));
        //BackgroundJob.ContinueJobWith(jobId, () => Console.WriteLine("Continuation job executed"));

        // BackgroundJob.Enqueue(() => Console.WriteLine("Critical job executed"), new EnqueuedState("critical"));

        //RecurringJob.AddOrUpdate("daily-task", () => Console.WriteLine("Recurring job executed"), Cron.Daily);
        //RecurringJob.AddOrUpdate<IUpdateStocksDataService>("update-stocks-data-task", (updateStocksDataService) => updateStocksDataService.UpdateData(DateTime.Now), Cron.Minutely());

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
