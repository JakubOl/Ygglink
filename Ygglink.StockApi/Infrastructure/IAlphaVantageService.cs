
namespace Ygglink.StockApi.Infrastructure
{
    public interface IAlphaVantageService
    {
        Task<object> GetLast7DaysAsync(string symbol);
    }
}