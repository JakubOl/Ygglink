using System.Text.Json.Serialization;

namespace Ygglink.ServiceDefaults.Models;

public record EventBase
{
    public EventBase()
    {
        Id = Guid.NewGuid();
        CreationDate = DateTime.UtcNow;
    }

    [JsonInclude]
    public Guid Id { get; set; }

    [JsonInclude]
    public DateTime CreationDate { get; set; }
}
