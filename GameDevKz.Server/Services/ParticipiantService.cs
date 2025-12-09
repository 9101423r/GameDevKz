using GameDevKz.Server.Controllers;
using GameDevKz.Server.DTOs;
using GameDevKz.Server.Model;
using Microsoft.EntityFrameworkCore;

namespace GameDevKz.Server.Services
{
    public class ParticipiantService : IParticipiantService
    {
        private readonly AppDbContext _db;
        private readonly ILogger<ParticipiantService> _logger;

        public ParticipiantService(AppDbContext db, ILogger<ParticipiantService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ParticipationRequest> CreateAsync(ParticipiantCreateDto dto)
        {
            _logger.LogInformation("Start create new Participiant Request");
            var ev = await _db.Events.FindAsync(dto.EventId);
            if (ev == null)
                throw new ArgumentException($"Событие с Id {dto.EventId} не найдено");

            var request = new ParticipationRequest
            {
                EventId = dto.EventId,
                Event = ev, 
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Message = dto.Message,
                Status = ParticipationRequest.ParticipationStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            // Сохраняем в БД
            _db.ParticipationRequests.Add(request);
            await _db.SaveChangesAsync();

            return request;
        }
    }
}
