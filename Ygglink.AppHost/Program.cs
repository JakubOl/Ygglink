using Ygglink.AppHost;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddForwardedHeaders();

var cache = builder
    .AddRedis("cache")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithRedisInsight();

//var papercut = builder.AddContainer("papercut", "changemakerstudiosus/papercut-smtp", "latest")
//    .WithHttpsEndpoint(port: 25, targetPort: 25)
//    .WithHttpEndpoint(port: 8050, targetPort: 8050)
//    .WithLifetime(ContainerLifetime.Persistent);

var sqlServer = builder
    .AddSqlServer("sql")
    .WithImage("mssql/server")
    .WithImageTag("latest")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var identityDb = sqlServer.AddDatabase("IdentityDatabase");

var identityApi = builder.AddProject<Projects.Ygglink_IdentityApi>("ygglink-identityapi", "https")
    .WaitFor(identityDb)
    .WithReference(identityDb);

var apiGateway = builder.AddProject<Projects.Ygglink_Gateway>("ygglink-gateway", "https")
    .WaitFor(identityApi)
    .WithReference(identityApi);

builder.AddNpmApp("angular", "../Ygglink.Web")
    .WaitFor(apiGateway)
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT", port: 4200)
    .PublishAsDockerFile();

var workerDb = sqlServer.AddDatabase("WorkerDatabase");

builder.AddProject<Projects.Ygglink_Worker>("ygglink-worker")
    .WaitFor(workerDb)
    .WithReference(workerDb);

builder.Build().Run();
