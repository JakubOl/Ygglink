using System.ComponentModel.DataAnnotations;

namespace Ygglink.ServiceDefaults.Infrastructure;

public class RabbitMqOptions
{
    [Required]
    public string Host { get; set; }

    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    public TimeSpan Timeout { get; set; }

    [Required]
    public int RetryCount { get; set; }
}
