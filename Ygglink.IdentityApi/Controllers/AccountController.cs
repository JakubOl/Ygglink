using Asp.Versioning;
using FluentEmail.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.IdentityApi.Models;

namespace Ygglink.IdentityApi.Controllers;

[ApiVersion(1)]
[ApiController]
[Route("api/v{v:apiVersion}/account")]
public class AccountController(
    ILogger<AccountController> logger,
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    TokenGenerator tokenGenerator,
    IFluentEmail fluentEmail) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        logger.LogInformation("User {@Username} login attempt", model.Email);

        if (!ModelState.IsValid)
        {
            logger.LogInformation("User {@Username} login attempt failed", model.Email);
            return BadRequest(ModelState);
        }

        var user = await userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            logger.LogInformation("User {@Username} login attempt failed", model.Email);
            return Unauthorized("Invalid username or password");
        }

        var result = await signInManager.PasswordSignInAsync(user, model.Password, false, false);
        if (!result.Succeeded)
        {
            logger.LogInformation("User {@Username} login attempt failed", model.Email);
            return Unauthorized("Invalid username or password");
        }

        if (!user.EmailConfirmed)
        {
            logger.LogInformation("User {@Username} login attempt failed", model.Email);
            return Unauthorized("Email is not confirmed");
        }

        logger.LogInformation("User {@Username} login attempt succeeded", model.Email);
        var token = tokenGenerator.GenerateJwtToken(user);
        return Ok(new { token });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        logger.LogInformation("User {@Username} register attempt", model.Email);

        if (!ModelState.IsValid)
        {
            logger.LogInformation("User {@Username} register attempt failed", model.Email);
            return BadRequest(ModelState);
        }

        var user = await userManager.FindByEmailAsync(model.Email);
        if (user != null)
        {
            logger.LogInformation("User {@Username} login attempt failed", model.Email);
            return Unauthorized("User with this email already exists!");
        }

        user = AppUser.CreateUser(Guid.NewGuid().ToString(), model.Name, model.Email);

        var result = await userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            logger.LogInformation("User {@Username} register attempt failed", model.Email);
            return BadRequest(result.Errors);
        }

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var frontendUrl = "http://localhost:4200/email-verify";
        var verificationUrl = $"{frontendUrl}?userId={user.Id}&token={encodedToken}";

        await fluentEmail
            .To(model.Email)
            .Subject("Email verification.")
            .Body($"To verify your email <a href='{verificationUrl}'>click here</a>", isHtml: true)
            .SendAsync();

        logger.LogInformation("User {@Username} register attempt succeeded", model.Email);

        return Ok(new { message = "Registration successful! Please check your email to verify your account." });
    }

    [HttpPost("verifyemail")]
    public async Task<IActionResult> VerifyToken([FromBody] EmailVerificationDto model)
    {
        if (string.IsNullOrEmpty(model.UserId) || string.IsNullOrEmpty(model.Token))
            return BadRequest("Invalid email verification request.");

        var user = await userManager.FindByIdAsync(model.UserId);
        if (user == null)
            return NotFound("User not found.");

        var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        var result = await userManager.ConfirmEmailAsync(user, decodedToken);

        if (!result.Succeeded)
            return BadRequest("Email verification failed.");

        return Ok(new { message = "Email verification successful." });
    }

    [HttpPost("resendverificationtoken")]
    public async Task<IActionResult> ResentVerificationToken([FromBody] EmailVerificationDto model)
    {
        var user = await userManager.FindByIdAsync(model.UserId);
        if (user == null)
            return Unauthorized("User does not exist.");

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var frontendUrl = "http://localhost:4200/email-verify";
        var verificationUrl = $"{frontendUrl}?userId={model.UserId}&token={encodedToken}";

        await fluentEmail
            .To(user.Email)
            .Subject("Email verification.")
            .Body($"To verify your email <a href='{verificationUrl}'>click here</a>", isHtml: true)
            .SendAsync();

        return Ok(new { message = "Please check your email to verify your account." });
    }
}
