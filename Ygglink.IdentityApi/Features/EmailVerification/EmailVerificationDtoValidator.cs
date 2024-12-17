using FluentValidation;

namespace Ygglink.IdentityApi.Features.EmailVerification;

public class EmailVerificationDtoValidator : AbstractValidator<EmailVerificationDto>
{
    public EmailVerificationDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required");

        RuleFor(x => x.Token)
            .NotEmpty().WithMessage("Token is required");
    }
}
