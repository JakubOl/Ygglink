using Microsoft.AspNetCore.Identity;
using Ygglink.ServiceDefaults.Models.Abstract;

namespace Ygglink.IdentityApi.Models;

public class AppUser : IdentityUser, IEntity
{
    List<IDomainEvent> IEntity._domainEvents { get; set; } = [];
    public static AppUser CreateUser(string Id, string UserName, string Email)
    {
        var user = new AppUser()
        {
            Id = Id,
            UserName = UserName,
            Email = Email
        };

        RaiseUserCreatedEvent(user);

        return user;
    }

    public static void RaiseUserCreatedEvent(AppUser user)
    {
        //((IEntity)user).RaiseDomainEvent(new UserCreatedEvent(Guid.NewGuid(), user));
    }
}
