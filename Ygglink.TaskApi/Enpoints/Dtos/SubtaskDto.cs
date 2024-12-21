using System.ComponentModel.DataAnnotations;
using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Enpoints.Dtos;

public class SubtaskDto
{
    [Required]
    [StringLength(100, ErrorMessage = "Subtask title cannot exceed 100 characters.")]
    public string Title { get; set; }

    public bool IsCompleted { get; set; }

    public Subtask MapToEntity()
    {
        return new Subtask
        {
            Title = Title,
            IsCompleted = IsCompleted,
        };
    }
}
