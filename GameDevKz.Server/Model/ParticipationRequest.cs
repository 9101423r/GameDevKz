namespace GameDevKz.Server.Model
{
    public class ParticipationRequest
    {
        public enum ParticipationStatus { Pending = 0, Approved = 1, Rejected = 2 }

        public int Id { get; set; }
        public int EventId { get; set; }
        public Event Event { get; set; } = null!;

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;
        public string? Message { get; set; }
        public ParticipationStatus Status { get; set; } = ParticipationStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
