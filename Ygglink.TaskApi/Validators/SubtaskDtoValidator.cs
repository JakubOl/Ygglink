using FluentValidation;
using Ygglink.TaskApi.Dtos;

namespace Ygglink.TaskApi.Validators;

public class SubtaskDtoValidator : AbstractValidator<SubtaskDto>
{
    public SubtaskDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Subtask title is required.")
            .MaximumLength(100).WithMessage("Subtask title cannot exceed 100 characters.");
    }
}
