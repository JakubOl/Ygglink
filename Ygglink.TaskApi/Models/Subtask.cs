using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Ygglink.TaskApi.Dtos;

namespace Ygglink.TaskApi.Models;

public class Subtask
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Subtask title is required.")]
    [StringLength(100, ErrorMessage = "Subtask title cannot exceed 100 characters.")]
    public string Title { get; set; }

    public bool IsCompleted { get; set; } = false;

    [ForeignKey("TaskItem")]
    public int TaskItemId { get; set; }

    public TaskItem TaskItem { get; set; }

    public SubtaskDto MapToDto()
    {
        return new SubtaskDto
        {
            Title = Title,
            IsCompleted = IsCompleted,
        };
    }
}
