using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GameDevKz.Server.Model
{
    public class Event
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        public string LocationUrl { get; set; } = string.Empty;

        public string CoverImageUrl { get; set; } = string.Empty;

        public DateTime EventStartDate { get; set; }

        public DateTime CreateDate { get; set; }

    }
}
