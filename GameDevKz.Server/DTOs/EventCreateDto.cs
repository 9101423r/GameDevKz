using System.ComponentModel.DataAnnotations;

namespace GameDevKz.Server.DTOs
{
    public class EventCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public string LocationUrl { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;

        public DateTime EventStartDate { get; set; }
    }
}
