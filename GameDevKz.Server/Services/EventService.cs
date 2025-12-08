using GameDevKz.Server.Model;
using GameDevKz.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace GameDevKz.Server.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _db;

        public EventService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<EventDto>> GetAllAsync()
        {
            return await _db.Events
                .Include(e => e.EventTags)
                    .ThenInclude(et => et.Tag)
                .Include(e => e.Photos)
                .Select(e => new EventDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Description = e.Description,
                    Location = e.Location,
                    CoverImageUrl = e.CoverImageUrl,
                    EventStartDate = e.EventStartDate,
                    Tags = e.EventTags.Select(et => et.Tag.Name),
                    PhotoUrls = e.Photos.Select(p => p.Url)
                })
                .ToListAsync();
        }
        public async Task<Event?> GetByIdAsync(int id)
            => await _db.Events.FindAsync(id);

        public async Task<Event> CreateAsync(EventCreateDto dto)
        {
            var ev = new Event
            {
                Name = dto.Name,
                Description = dto.Description,
                Location = dto.Location,
                LocationUrl = dto.LocationUrl,
                CoverImageUrl = dto.CoverImageUrl,
                EventStartDate = dto.EventStartDate,
                CreateDate = DateTime.UtcNow
            };

            _db.Events.Add(ev);
            await _db.SaveChangesAsync();

            return ev;
        }

        public async Task<Event?> UpdateAsync(int id, EventUpdateDto dto)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return null;

            ev.Name = dto.Name;
            ev.Description = dto.Description;
            ev.Location = dto.Location;
            ev.LocationUrl = dto.LocationUrl;
            ev.CoverImageUrl = dto.CoverImageUrl;
            ev.EventStartDate = dto.EventStartDate;

            await _db.SaveChangesAsync();
            return ev;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return false;

            _db.Events.Remove(ev);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
