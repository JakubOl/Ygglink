using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Ygglink.StockApi.Model;

public class UserWatchlist
{
    [BsonId]
    public ObjectId Id { get; set; }
    public string UserId { get; set; }
    public List<string> Stocks { get; set; }
    public UserWatchlistDto MapToDto()
    {
        return new UserWatchlistDto
        {
            Stocks = Stocks
        };
    }
}
