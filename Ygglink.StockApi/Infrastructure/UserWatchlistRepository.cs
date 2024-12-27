using MongoDB.Driver;
using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Infrastructure;

public class UserWatchlistRepository(IMongoClient client) : IUserWatchlistRepository
{
    private IMongoCollection<UserWatchlist> userWatchlists => client.GetDatabase("StockDatabase").GetCollection<UserWatchlist>("UserWatchlists");

    public async Task<UserWatchlist> GetAsync(string userId) => 
        await userWatchlists.Find(subscription => subscription.UserId == userId).FirstOrDefaultAsync() ?? new UserWatchlist() { UserId = userId, Stocks = [] };
    public async Task UpdateAsync(UserWatchlist userWatchlist) => await userWatchlists.ReplaceOneAsync(s => s.UserId == userWatchlist.UserId, userWatchlist);
}
