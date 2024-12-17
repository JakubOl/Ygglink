using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Ygglink.IdentityApi.Infrastructure;

public class IdentityDbContext(DbContextOptions<IdentityDbContext> options) : IdentityDbContext<AppUser>(options)
{
    protected override void OnModelCreating(ModelBuilder builder) => base.OnModelCreating(builder);

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);

        await PublishDomainEventsAsync(cancellationToken);

        return result;
    }

    private async Task PublishDomainEventsAsync(CancellationToken cancellationToken)
    {
        //var domainEvents = ChangeTracker
        //    .Entries<IEntity>()
        //    .Select(entry => entry.Entity)
        //    .SelectMany(entity =>
        //    {
        //        var domainEvents = entity.GetDomainEvents();

        //        entity.ClearDomainEvents();

        //        return domainEvents;
        //    })
        //    .ToList();

        //foreach (var domainEvent in domainEvents)
        //    await publisher.Publish(domainEvent, cancellationToken);
    }
}
