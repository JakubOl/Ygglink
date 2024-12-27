using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Infrastructure;

public interface IUserWatchlistRepository
{
    Task<UserWatchlist> GetAsync(string userId);
    Task UpdateAsync(UserWatchlist userWatchlist);
}
