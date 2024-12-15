﻿using System.ComponentModel.DataAnnotations;

namespace Ygglink.IdentityApi.Models;

public record LoginDto
{
    [Required]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}
