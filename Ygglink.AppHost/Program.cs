var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var sqlServer = builder
    .AddSqlServer("sql")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var identityDb = sqlServer.AddDatabase("IdentityDatabase");

var identityApi = builder.AddProject<Projects.Ygglink_IdentityApi>("ygglink-identityapi")
    .WaitFor(identityDb)
    .WithReference(identityDb);

var apiGateway = builder.AddProject<Projects.Ygglink_Gateway>("ygglink-gateway")
    .WaitFor(identityApi)
    .WithReference(identityApi);

builder.AddNpmApp("angular", "../Ygglink.Web")
    .WithReference(apiGateway)
    .WaitFor(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

var workerDb = sqlServer.AddDatabase("WorkerDb");

builder.AddProject<Projects.Ygglink_Worker>("ygglink-worker")
    .WaitFor(workerDb)
    .WithReference(workerDb);

builder.Build().Run();
