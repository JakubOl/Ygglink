using Ygglink.AppHost;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddForwardedHeaders();

var cache = builder
    .AddRedis("cache")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithRedisInsight();

var sqlServer = builder
    .AddSqlServer("sql")
    .WithImage("mssql/server")
    .WithImageTag("latest")
    .WithLifetime(ContainerLifetime.Persistent);

var identityDb = sqlServer.AddDatabase("IdentityDatabase");

var launchProfileName = "https";

var identityApi = builder.AddProject<Projects.Ygglink_IdentityApi>("ygglink-identityapi", launchProfileName)
    .WaitFor(identityDb)
    .WithReference(identityDb)
    .WithExternalHttpEndpoints();

var identityEndpoint = identityApi.GetEndpoint(launchProfileName);

var apiGateway = builder.AddProject<Projects.Ygglink_Gateway>("ygglink-gateway")
    .WaitFor(identityApi)
    .WithReference(identityApi);

var gatewayEndpoint = apiGateway.GetEndpoint(launchProfileName);

builder.AddNpmApp("angular", "../Ygglink.Web")
    .WaitFor(identityApi)
    .WithReference(identityApi)
    .WithHttpEndpoint(env: "PORT", port: 4200)
    .PublishAsDockerFile();

var workerDb = sqlServer.AddDatabase("WorkerDatabase");

builder.AddProject<Projects.Ygglink_Worker>("ygglink-worker")
    .WaitFor(workerDb)
    .WithReference(workerDb);

builder.Build().Run();
