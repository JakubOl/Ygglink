using FluentValidation;
using Ygglink.TaskApi.Dtos;

namespace Ygglink.TaskApi.Validators;

public class TaskItemDtoValidator : AbstractValidator<TaskItemDto>
{
    public TaskItemDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.");

        RuleFor(x => x.Date)
            .NotNull().WithMessage("Date is required.");

        RuleFor(x => x.Subtasks)
            .SetValidator(SubtaskDtoValidator);
    }
}
