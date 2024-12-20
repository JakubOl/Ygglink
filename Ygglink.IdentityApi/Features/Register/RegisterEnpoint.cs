using FluentEmail.Core;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Models.Abstract;
using FluentValidation;

namespace Ygglink.IdentityApi.Features.Register;

public class RegisterEnpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("account/register", 
                async (RegisterDto model,
                ILogger<RegisterEnpoint> logger,
                UserManager<AppUser> userManager,
                IFluentEmail fluentEmail,
                IValidator<RegisterDto> validator) =>
                {
                    logger.LogInformation("User {@Username} register attempt", model.Email);

                    var validationResult = await validator.ValidateAsync(model);
                    if (!validationResult.IsValid)
                    {
                        logger.LogInformation("User {@Username} register attempt failed", model.Email);
                        return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
                    }

                    var user = await userManager.FindByEmailAsync(model.Email);
                    if (user != null)
                    {
                        logger.LogInformation("User {@Username} login attempt failed", model.Email);
                        return Results.Problem("User with this email already exists!", statusCode: 401);
                    }

                    user = AppUser.CreateUser(Guid.NewGuid().ToString(), model.Name, model.Email);

                    var result = await userManager.CreateAsync(user, model.Password);

                    if (!result.Succeeded)
                    {
                        logger.LogInformation("User {@Username} register attempt failed", model.Email);
                        return Results.Problem(string.Join(",", result.Errors.Select(x => x.Description)), statusCode: 401);
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

                    return Results.Ok(new { message = "Registration successful! Please check your email to verify your account." });
                })
            .Accepts<RegisterDto>("application/json")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("UserRegister")
            .WithOpenApi(operation =>
            {
                operation.Summary = "User registration endpoint";
                operation.Description = "Creates a new user account and sends an email verification link.";
                return operation;
            });

        app.MapGet("account/Echo",
                async (ILogger<RegisterEnpoint> logger,
                UserManager<AppUser> userManager,
                IFluentEmail fluentEmail,
                IValidator<RegisterDto> validator) =>
                {
                    return Results.Ok(new { message = "Registration successful! Please check your email to verify your account." });
                })
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("Test")
            .WithOpenApi(operation =>
            {
                operation.Summary = "User registration endpoint";
                operation.Description = "Creates a new user account and sends an email verification link.";
                return operation;
            });
    }
}
