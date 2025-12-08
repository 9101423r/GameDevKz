namespace GameDevKz.Server.Model
{
    public class Photo
    {
        public int Id { get; set; }
        public int EventId { get; set; }
        public Event Event { get; set; } = null!;

        public string Url { get; set; } = string.Empty; // относительный путь, например "/uploads/events/1/abc.jpg"
        public string? Caption { get; set; }
        public int Order { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
