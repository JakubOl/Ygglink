using FluentValidation;
using Ygglink.TaskApi.Dtos;

namespace Ygglink.TaskApi.Validators;

public class TaskItemDtoValidator : AbstractValidator<TaskItemDto>
{
    public TaskItemDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Description cannot exceed 100 characters.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.StartDate)
            .NotNull().WithMessage("Start date is required.");

        RuleFor(x => x.EndDate)
            .NotNull().WithMessage("End date is required.");

        RuleFor(x => x.Subtasks)
            .ForEach(x => x.SetValidator(new SubtaskDtoValidator()));
    }
}
