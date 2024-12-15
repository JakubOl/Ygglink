using Aspire.Hosting;
using Ygglink.AppHost;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddForwardedHeaders();

var cache = builder.AddRedis("cache");

var sqlServer = builder
    .AddSqlServer("sql")
    .WithImage("mssql/server")
    .WithImageTag("latest")
    .WithLifetime(ContainerLifetime.Persistent);

var identityDb = sqlServer.AddDatabase("IdentityDatabase");

var launchProfileName = "https";

var identityApi = builder.AddProject<Projects.Ygglink_IdentityApi>("ygglink-identityapi", launchProfileName)
    .WaitFor(identityDb)
    .WithReference(identityDb);

var identityEndpoint = identityApi.GetEndpoint(launchProfileName);

var apiGateway = builder.AddProject<Projects.Ygglink_Gateway>("ygglink-gateway")
    .WaitFor(identityApi)
    .WithReference(identityApi)
    .WithEnvironment("Identity_Url", identityEndpoint);

var gatewayEndpoint = apiGateway.GetEndpoint(launchProfileName);

builder.AddNpmApp("angular", "../Ygglink.Web")
    .WithReference(apiGateway)
    .WaitFor(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithEnvironment("Gateway_Url", gatewayEndpoint)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

var workerDb = sqlServer.AddDatabase("WorkerDb");

builder.AddProject<Projects.Ygglink_Worker>("ygglink-worker")
    .WaitFor(workerDb)
    .WithReference(workerDb);

builder.Build().Run();
