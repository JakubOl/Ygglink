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
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var identityDb = sqlServer.AddDatabase("IdentityDatabase");
var taskDb = sqlServer.AddDatabase("TaskDatabase");
var workerDb = sqlServer.AddDatabase("WorkerDatabase");
var stockDb = sqlServer.AddDatabase("StockDatabase");

var identityApi = builder.AddProject<Projects.Ygglink_IdentityApi>("ygglink-identityapi")
    .WaitFor(identityDb)
    .WithReference(identityDb);

var taskApi = builder.AddProject<Projects.Ygglink_TaskApi>("ygglink-taskapi")
    .WaitFor(taskDb)
    .WithReference(taskDb);

var apiGateway = builder.AddProject<Projects.Ygglink_Gateway>("ygglink-gateway", "https")
    .WaitFor(identityApi)
    .WaitFor(taskApi)
    .WithReference(identityApi)
    .WithReference(taskApi);

builder.AddNpmApp("angular", "../Ygglink.Web")
    .WaitFor(apiGateway)
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT", port: 4200)
    .PublishAsDockerFile();

builder.AddProject<Projects.Ygglink_Worker>("ygglink-worker")
    .WaitFor(workerDb)
    .WithReference(workerDb);

var mongo = builder.AddMongoDB("mongo")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var mongodb = mongo.AddDatabase("mongodb");

builder.AddProject<Projects.Ygglink_StockApi>("ygglink-stockapi")
    .WaitFor(mongodb)
    .WithReference(mongodb)
    .WaitFor(stockDb)
    .WithReference(stockDb);

builder.Build().Run();
