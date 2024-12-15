using Microsoft.AspNetCore.Routing;

namespace Ygglink.ServiceDefaults.Models.Abstract;

public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
