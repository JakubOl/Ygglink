using Microsoft.EntityFrameworkCore;
using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Infrastructure;

public class StockDbContext(DbContextOptions<StockDbContext> options) : DbContext(options)
{
    public DbSet<Stock> Stocks { get; set; }
    public DbSet<StockData> StocksData { get; set; }
}
