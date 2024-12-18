using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Ygglink.IdentityApi.Features.Login;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Models.Abstract;

namespace Ygglink.IdentityApi.Features.EmailVerification;

public class VerifyEmailEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("account/verifyemail", 
                async (EmailVerificationDto model,
                    ILogger<LoginEndpoint> logger,
                    UserManager<AppUser> userManager,
                    IValidator<EmailVerificationDto> validator) =>
                {
                    var validationResult = await validator.ValidateAsync(model);
                    if (!validationResult.IsValid)
                        return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

                    var user = await userManager.FindByIdAsync(model.UserId);
                    if (user == null)
                        return Results.BadRequest("User not found.");

                    var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
                    var result = await userManager.ConfirmEmailAsync(user, decodedToken);

                    if (!result.Succeeded)
                        return Results.BadRequest("Email verification failed");

                    return Results.Ok(new { message = "Email verification successful." });
                })
            .Accepts<EmailVerificationDto>("application/json")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .WithName("VerifyEmail")
            .WithOpenApi(operation =>
            {
                operation.Summary = "User verify email endpoint";
                operation.Description = "Verifies user email.";
                return operation;
            });
    }
}
