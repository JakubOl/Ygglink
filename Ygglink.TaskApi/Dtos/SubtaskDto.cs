using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Dtos;

public class SubtaskDto
{
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
