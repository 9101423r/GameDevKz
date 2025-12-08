namespace GameDevKz.Server.Areas.Admin.Models
{
    public class PhotoViewModel
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Caption { get; set; }
    }
}
