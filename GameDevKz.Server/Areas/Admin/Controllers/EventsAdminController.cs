using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using GameDevKz.Server.Model;
using Microsoft.EntityFrameworkCore;


namespace GameDevKz.Server.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class EventsAdminController : Controller
    {
        private readonly AppDbContext _db;
        public EventsAdminController(AppDbContext db) => _db = db;

        public async Task<IActionResult> Index()
        {
            var items = await _db.Events.OrderByDescending(e => e.EventStartDate).ToListAsync();
            return View(items);
        }

        public IActionResult Create() => View(new Event());

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Event model)
        {
            if (!ModelState.IsValid) return View(model);
            model.CreateDate = DateTime.UtcNow;
            _db.Events.Add(model);
            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound();
            return View(ev);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Event model)
        {
            if (id != model.Id) return BadRequest();
            if (!ModelState.IsValid) return View(model);

            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound();

            ev.Name = model.Name;
            ev.Description = model.Description;
            ev.Location = model.Location;
            ev.EventStartDate = model.EventStartDate;

            await _db.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound();
            return View(ev);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev != null)
            {
                _db.Events.Remove(ev);
                await _db.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
