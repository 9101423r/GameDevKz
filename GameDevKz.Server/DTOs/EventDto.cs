namespace GameDevKz.Server.DTOs
{
    public class EventDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public DateTime EventStartDate { get; set; }
        public IEnumerable<string> Tags { get; set; } = new List<string>();
        public IEnumerable<string> PhotoUrls { get; set; } = new List<string>();
    }
}
