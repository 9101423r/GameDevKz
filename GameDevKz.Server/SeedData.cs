using GameDevKz.Server.Model;
using Microsoft.AspNetCore.Identity;

namespace GameDevKz.Server
{
    public class SeedData
    {
        public static async Task EnsureSeedDataAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleMgr = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            const string adminRole = "Admin";
            const string adminEmail = "vladimir@thehub.su";
            const string adminPassword = "123123";

            if (!await roleMgr.RoleExistsAsync(adminRole))
                await roleMgr.CreateAsync(new IdentityRole(adminRole));

            var admin = await userMgr.FindByEmailAsync(adminEmail);
            if (admin == null)
            {
                admin = new ApplicationUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                var res = await userMgr.CreateAsync(admin, adminPassword);
                if (res.Succeeded)
                {
                    await userMgr.AddToRoleAsync(admin, adminRole);
                }
            }
            else
            {
                if (!await userMgr.IsInRoleAsync(admin, adminRole))
                    await userMgr.AddToRoleAsync(admin, adminRole);
            }
        }
    }
}
