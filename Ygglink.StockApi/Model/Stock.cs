using System.ComponentModel.DataAnnotations;

namespace Ygglink.StockApi.Model;

public class Stock
{
    [Key]
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}