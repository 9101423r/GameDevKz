using System.ComponentModel.DataAnnotations;

namespace GameDevKz.Server.Areas.Admin.Models
{
    public class EventEditViewModel
    {
        public int Id { get; set; }

        [Required, MaxLength(30)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        public string LocationUrl { get; set; } = string.Empty;

        public string CoverImageUrl { get; set; } = string.Empty;

        [Display(Name = "Дата события")]
        public DateTime EventStartDate { get; set; } = DateTime.UtcNow;

        // UI-only fields:
        [Display(Name = "Тэги (через запятую)")]
        public string TagsInput { get; set; } = string.Empty;

        // For file upload (optional)
        public IFormFileCollection? PhotoFiles { get; set; }

        // For displaying existing photos/tags in the view
        public List<PhotoViewModel> Photos { get; set; } = new();
        public List<string> TagNames { get; set; } = new();
    }
}
