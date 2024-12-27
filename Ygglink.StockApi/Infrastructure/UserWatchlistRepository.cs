using MongoDB.Driver;
using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Infrastructure;

public class UserWatchlistRepository(IMongoClient client) : IUserWatchlistRepository
{
    private IMongoCollection<UserWatchlist> userWatchlists => client.GetDatabase("StockDatabase").GetCollection<UserWatchlist>("UserWatchlists");

    public async Task<UserWatchlist> GetAsync(string userId) => 
        await userWatchlists.Find(userWatchlist => userWatchlist.UserId == userId).FirstOrDefaultAsync() ?? new UserWatchlist() { UserId = userId, Stocks = [] };
    public async Task UpdateAsync(UserWatchlist userWatchlist)
    {
        var dbWatchlist = await userWatchlists.Find(w => w.UserId == userWatchlist.UserId).FirstOrDefaultAsync();
        if (dbWatchlist != null)
        {
            userWatchlist.Id = dbWatchlist.Id;
            await userWatchlists.ReplaceOneAsync(s => s.UserId == userWatchlist.UserId, userWatchlist);
            return;
        }

        await userWatchlists.InsertOneAsync(userWatchlist);
    }
}
