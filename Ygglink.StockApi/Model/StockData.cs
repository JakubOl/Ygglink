using System.ComponentModel.DataAnnotations;

namespace Ygglink.StockApi.Model;

public class StockData
{
    [Key]
    public int Id { get; set; }
    public int StockId { get; set; }
    public DateTime Date { get; set; }
    public float Open { get; set; }
    public float Close { get; set; }
    public float Low { get; set; }
    public float High { get; set; }
}
