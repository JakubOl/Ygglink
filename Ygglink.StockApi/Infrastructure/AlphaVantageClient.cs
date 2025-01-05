using System.Text.Json;
using System.Text.Json.Serialization;

namespace Ygglink.StockApi.Infrastructure;

public class AlphaVantageService(HttpClient httpClient, IConfiguration configuration) : IAlphaVantageService
{
    public async Task<object> GetLast7DaysAsync(string symbol)
    {
        var apiKey = configuration["StockApiKey"];
        string requestUrl = $"https://www.alphavantage.co/query?function=TIME_SERIES_DAILY" +
            $"&symbol={symbol}" +
            $"&apikey={apiKey}" +
            $"&outputsize=compact";

        var jsonResponse = await httpClient.GetStringAsync(requestUrl);

        var dailyDataResponse = JsonSerializer.Deserialize<TimeSeriesDailyResponse>(jsonResponse);

        var last7Days = dailyDataResponse.TimeSeriesDaily
            .Select(entry => new
            {
                Date = DateTime.Parse(entry.Key),
                entry.Value.Open,
                entry.Value.High,
                entry.Value.Low,
                entry.Value.Close,
                entry.Value.Volume
            })
            .OrderByDescending(d => d.Date)
            .Take(7)
            .OrderBy(d => d.Date)
            .ToList();

        return last7Days;
    }
}

public class TimeSeriesDailyResponse
{
    [JsonPropertyName("Meta Data")]
    public MetaData MetaData { get; set; }

    [JsonPropertyName("Time Series (Daily)")]
    public Dictionary<string, DailyPrice> TimeSeriesDaily { get; set; }
}

public class MetaData
{
    [JsonPropertyName("1. Information")]
    public string Information { get; set; } = string.Empty;

    [JsonPropertyName("2. Symbol")]
    public string Symbol { get; set; } = string.Empty;

    [JsonPropertyName("3. Last Refreshed")]
    public string LastRefreshed { get; set; } = string.Empty;

    [JsonPropertyName("4. Output Size")]
    public string OutputSize { get; set; } = string.Empty;

    [JsonPropertyName("5. Time Zone")]
    public string TimeZone { get; set; } = string.Empty;
}

public class DailyPrice
{
    [JsonPropertyName("1. open")]
    public string Open { get; set; } = string.Empty;

    [JsonPropertyName("2. high")]
    public string High { get; set; } = string.Empty;

    [JsonPropertyName("3. low")]
    public string Low { get; set; } = string.Empty;

    [JsonPropertyName("4. close")]
    public string Close { get; set; } = string.Empty;

    [JsonPropertyName("5. volume")]
    public string Volume { get; set; } = string.Empty;
}

