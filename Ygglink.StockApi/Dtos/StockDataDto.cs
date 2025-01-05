using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Dtos;

public record StockDataDto(string Symbol, List<StockData> Data);
