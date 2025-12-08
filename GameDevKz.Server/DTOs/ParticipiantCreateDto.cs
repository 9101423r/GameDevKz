using GameDevKz.Server.Model;
using static GameDevKz.Server.Model.ParticipationRequest;

namespace GameDevKz.Server.DTOs
{
    public class ParticipiantCreateDto
    {
        public int EventId { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
        public string? Message { get; set; }

    }
}
