using FluentValidation;
using Ygglink.StockApi.Model;

namespace Ygglink.StockApi.Validators;

public class UserWatchlistValidator : AbstractValidator<UserWatchlist>
{
    public UserWatchlistValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required.");
    }
}
