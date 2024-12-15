using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Ygglink.ServiceDefaults.Infrastructure;

namespace Ygglink.ServiceDefaults;

public static class EventBusExtensions
{
    public static IServiceCollection AddMassTransitWithRabbitMQ(
        this IServiceCollection services,
        params (Type consumerType, string queueName)[] consumers)
    {
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();

            foreach (var (consumerType, queueName) in consumers)
                x.AddConsumer(consumerType);

            x.UsingRabbitMq((context, cfg) =>
            {
                var options = context.GetRequiredService<IOptions<RabbitMqOptions>>().Value;

                cfg.Host(options.Host, h =>
                {
                    h.Username(options.Username);
                    h.Password(options.Password);
                });

                cfg.UseMessageRetry(retryConfig =>
                {
                    retryConfig.Interval(options.RetryCount, TimeSpan.FromSeconds(1));
                });

                cfg.UseTimeout(timeoutConfig =>
                {
                    timeoutConfig.Timeout = options.Timeout;
                });

                foreach (var (consumerType, queueName) in consumers)
                {
                    cfg.ReceiveEndpoint($"{queueName}-queue", e =>
                    {
                        e.ConfigureConsumer(context, consumerType);

                        e.Bind($"{queueName}-exchange", x =>
                        {
                            x.Durable = true;
                            x.AutoDelete = false;
                        });
                    });

                }
            });
        });

        services
            .AddOptions<MassTransitHostOptions>()
            .Configure(options =>
            {
                options.WaitUntilStarted = true;
                options.StartTimeout = TimeSpan.FromSeconds(30);
                options.StopTimeout = TimeSpan.FromSeconds(60);
            });

        return services;
    }

    public static async Task SendToQueue<T>(this IBus bus, string queueName, T message, CancellationToken cancellationToken) where T : EventBase
    {
        var sendEndpoint = await bus.GetSendEndpoint(new Uri($"queue:{queueName}-queue"));
        await sendEndpoint.Send(message, cancellationToken);
    }
}
