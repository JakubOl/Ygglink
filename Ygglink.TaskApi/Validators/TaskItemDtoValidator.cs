using FluentValidation;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Validators;

public class TaskItemDtoValidator : AbstractValidator<TaskItemDto>
{
    public TaskItemDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Description cannot exceed 100 characters.");

        RuleFor(x => x.StartDate)
            .NotNull().WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .NotNull().WithMessage("End date is required.");
    }
}
