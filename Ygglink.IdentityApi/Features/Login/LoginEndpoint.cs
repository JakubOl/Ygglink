using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Models.Abstract;

namespace Ygglink.IdentityApi.Features.Login;

public class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        var accountGroup = app.MapGroup("api/v{v:apiVersion}/account");
        accountGroup.MapPost("login", async (LoginDto model,
            ILogger<LoginEndpoint> logger,
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            TokenGenerator tokenGenerator,
            IValidator<LoginDto> validator) =>
        {
            logger.LogInformation("User {@Username} login attempt", model.Email);

            var validationResult = await validator.ValidateAsync(model);
            if (!validationResult.IsValid)
            {
                logger.LogInformation("User {@Username} login attempt failed", model.Email);
                return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user is null)
            {
                logger.LogInformation("User {@Username} login attempt failed", model.Email);
                return Results.Problem("Invalid username or password", statusCode: 401);
            }

            var signInResult = await signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (!signInResult.Succeeded)
            {
                logger.LogInformation("User {@Username} login attempt failed", model.Email);
                return Results.Problem("Invalid username or password", statusCode: 401);
            }

            if (!user.EmailConfirmed)
            {
                logger.LogInformation("User {@Username} login attempt failed", model.Email);
                return Results.Problem("Email is not confirmed", statusCode: 401);
            }

            logger.LogInformation("User {@Username} login attempt succeeded", model.Email);

            var token = tokenGenerator.GenerateJwtToken(user);
            return Results.Ok(new { token });
        });
    }
}
