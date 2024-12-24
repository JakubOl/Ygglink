using Ygglink.TaskApi.Models;

namespace Ygglink.TaskApi.Dtos;

public class TaskItemDto
{
    public Guid Guid { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<SubtaskDto> Subtasks { get; set; }

    public TaskItem MapToEntity()
    {
        return new TaskItem
        {
            Guid = Guid,
            StartDate = StartDate,
            EndDate = EndDate,
            Description = Description,
            Title = Title,
            Subtasks = Subtasks?.Select(st => st.MapToEntity()).ToList(),
        };
    }
}
