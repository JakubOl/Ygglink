namespace Ygglink.StockApi.Model;

public class UserWatchlist
{
    public string UserId { get; set; } = string.Empty;
    public List<string> Stocks { get; set; } = [];
}
