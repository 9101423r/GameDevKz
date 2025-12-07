using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GameDevKz.Server.Model
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        public  string FullName { get; set; } = string.Empty;
    }
}
