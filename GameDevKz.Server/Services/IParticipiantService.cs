using GameDevKz.Server.DTOs;
using GameDevKz.Server.Model;

namespace GameDevKz.Server.Services
{
    public interface IParticipiantService
    {
        Task<ParticipationRequest> CreateAsync(ParticipiantCreateDto dto);
    }
}
