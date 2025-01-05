using Microsoft.AspNetCore.Mvc;
using Ygglink.ServiceDefaults.Models.Abstract;
using Ygglink.StockApi.Dtos;
using Ygglink.StockApi.Infrastructure;

namespace Ygglink.StockApi.Endpoints;

public class GetStockDataEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("stocks",
                ([FromQuery] string[] stocks,
                StockDbContext context) =>
                {
                    var periodEnd = DateTime.Now;
                    var periodStart = periodEnd.AddDays(-7);

                    var stocksData = context.Stocks
                        .Where(x => stocks.Contains(x.Name))
                        .GroupJoin(context.StocksData.Where(x => x.Date > periodStart && x.Date <= periodEnd),
                            s => s.Id,
                            sd => sd.StockId,
                            (s, sd) => new { StockName = s.Name, Values = sd })
                        .AsEnumerable()
                        .Select(s => new StockDataDto(s.StockName, s.Values.ToList()));

                    return Results.Ok(stocksData);
                })
            .Produces(StatusCodes.Status200OK)
            .WithName("Stocks")
            .WithOpenApi(operation =>
            {
                operation.Summary = "Stocks Endpoint";
                operation.Description = "Returns stocks values from previous 7 days.";
                return operation;
            })
            .RequireAuthorization();
    }
}
