using GameDevKz.Server.DTOs;
using GameDevKz.Server.Model;

namespace GameDevKz.Server.Services
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event?> GetByIdAsync(int id);
        Task<Event> CreateAsync(EventCreateDto dto);
        Task<Event?> UpdateAsync(int id, EventUpdateDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
