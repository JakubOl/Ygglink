using FluentEmail.Core;
using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Ygglink.IdentityApi.Features.Login;
using Ygglink.IdentityApi.Infrastructure;
using Ygglink.ServiceDefaults.Models.Abstract;

namespace Ygglink.IdentityApi.Features.EmailVerification;

public class ResentVerificationTokenEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("account/resendverificationtoken", 
                async (EmailVerificationDto model,
                    ILogger<LoginEndpoint> logger,
                    UserManager<AppUser> userManager,
                    IFluentEmail fluentEmail,
                    IValidator<EmailVerificationDto> validator) =>
                {
                    var validationResult = await validator.ValidateAsync(model);
                    if (!validationResult.IsValid)
                        return Results.BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));

                    var user = await userManager.FindByIdAsync(model.UserId);
                    if (user == null)
                        return Results.Problem("User does not exist.", statusCode: 401);

                    var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

                    var frontendUrl = "http://localhost:4200/email-verify";
                    var verificationUrl = $"{frontendUrl}?userId={model.UserId}&token={encodedToken}";

                    await fluentEmail
                        .To(user.Email)
                        .Subject("Email verification.")
                        .Body($"To verify your email <a href='{verificationUrl}'>click here</a>", isHtml: true)
                        .SendAsync();

                    return Results.Ok(new { message = "Please check your email to verify your account." });
                })
            .Accepts<EmailVerificationDto>("application/json")
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .WithName("ResendEmailVerificationToken")
            .WithOpenApi(operation =>
            {
                operation.Summary = "User resend email verification email token endpoint";
                operation.Description = "Resends email verification token.";
                return operation;
            });
    }
}
