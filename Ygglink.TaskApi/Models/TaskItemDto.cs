namespace Ygglink.TaskApi.Models;

public class TaskItemDto
{
    public Guid Guid { get; set; }
    public string Title { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public TaskItem MapToEntity()
    {
        return new TaskItem
        {
            Guid = Guid,
            StartDate = StartDate,
            EndDate = EndDate,
            Title = Title,
        };
    }
}
