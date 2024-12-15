namespace Ygglink.ServiceDefaults.Models.Abstract;

public interface IEntity
{
    List<IDomainEvent> _domainEvents { get; set; }
    IReadOnlyList<IDomainEvent> GetDomainEvents() => [.. _domainEvents];
    void ClearDomainEvents() => _domainEvents.Clear();
    void RaiseDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);
}
