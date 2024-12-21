using System.ComponentModel.DataAnnotations;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Enpoints.Dtos;

public class TaskItemDto
{
    public Guid Guid { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string Title { get; set; }

    [Required]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; }

    [Required]
    public DateTime Date { get; set; }

    public bool IsRecurring { get; set; }

    public List<SubtaskDto> Subtasks { get; set; }

    public TaskItem MapToEntity()
    {
        return new TaskItem
        {
            Guid = Guid,
            Date = Date,
            Description = Description,
            Title = Title,
            IsRecurring = IsRecurring,
            Subtasks = Subtasks?.Select(st => st.MapToEntity()).ToList(),
        };
    }
}
