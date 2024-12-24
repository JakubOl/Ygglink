using System.ComponentModel.DataAnnotations;
using Ygglink.TaskApi.Dtos;

namespace Ygglink.TaskApi.Models;

public class TaskItem
{
    [Key]
    public int Id { get; set; }

    public Guid Guid { get; set; }

    [Required(ErrorMessage = "Title is required.")]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string Title { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; }

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime EndDate { get; set; }

    public Guid UserId { get; set; }
    public ICollection<Subtask> Subtasks { get; set; }

    public TaskItemDto MapToDto()
    {
        return new TaskItemDto
        {
            Guid = Guid,
            StartDate = StartDate,
            EndDate = EndDate,
            Title = Title,
            Description = Description,
            Subtasks = Subtasks.Select(st => st.MapToDto()).ToList(),
        };
    }
}
