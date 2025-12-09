using GameDevKz.Server.Areas.Admin.Models;
using GameDevKz.Server.Controllers;
using GameDevKz.Server.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GameDevKz.Server.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class AccountController(SignInManager<ApplicationUser> signIn, UserManager<ApplicationUser> userManager, ILogger<AccountController> logger) : Controller
    {
        private readonly SignInManager<ApplicationUser> _signIn = signIn;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly ILogger<AccountController> _logger = logger;

        [HttpGet]
        public IActionResult Login(string? returnUrl = null) => View(new LoginViewModel { ReturnUrl = returnUrl });

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel vm)
        {
            try
            {
                _logger.LogInformation("Start login user");
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Login ModelState is not valid!");
                    return View(vm);
                }

                var user = await _userManager.FindByEmailAsync(vm.Email);
                if (user == null)
                {
                    ModelState.AddModelError("", "Invalid credentials");
                    _logger.LogInformation("Invalid credentials");
                    return View(vm);
                }

                var res = await _signIn.PasswordSignInAsync(user.UserName, vm.Password, vm.RememberMe, lockoutOnFailure: false);
                if (res.Succeeded)
                {
                    if (!string.IsNullOrEmpty(vm.ReturnUrl) && Url.IsLocalUrl(vm.ReturnUrl)) return Redirect(vm.ReturnUrl);
                    return RedirectToAction("Index", "EventsAdmin", new { area = "Admin" });
                }

                ModelState.AddModelError("", "Invalid credentials");
                return View(vm);
            }
            catch (Exception ex) {
                _logger.LogError(ex, "Admin auth exception!");
                return StatusCode(500, "Internal server error");
            }
            
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signIn.SignOutAsync();
            return RedirectToAction("Login", "Account", new { area = "Admin" });
        }
    }
}
