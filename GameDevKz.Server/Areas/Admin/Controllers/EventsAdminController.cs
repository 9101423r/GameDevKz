using GameDevKz.Server.Areas.Admin.Models;
using GameDevKz.Server.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static GameDevKz.Server.Model.ParticipationRequest;

namespace GameDevKz.Server.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class EventsAdminController : Controller
    {
        private readonly AppDbContext _db;

        public EventsAdminController(AppDbContext db) => _db = db;

        // -------------------------
        // INDEX
        // -------------------------
        public async Task<IActionResult> Index()
        {
            var items = await _db.Events
                .OrderByDescending(e => e.EventStartDate)
                .ToListAsync();

            return View(items);
        }

        // -------------------------
        // CREATE (GET)
        // -------------------------
        public IActionResult Create()
        {
            var vm = new EventEditViewModel
            {
                EventStartDate = DateTime.UtcNow
            };
            return View(vm);
        }

        // -------------------------
        // CREATE (POST)
        // -------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(EventEditViewModel vm)
        {
            if (!ModelState.IsValid) return View(vm);

            var ev = new Event
            {
                Name = vm.Name,
                Description = vm.Description,
                Location = vm.Location,
                LocationUrl = vm.LocationUrl,
                CoverImageUrl = vm.CoverImageUrl,
                EventStartDate = vm.EventStartDate,
                CreateDate = DateTime.UtcNow,
                EventTags = new List<EventTag>(),
                Photos = new List<Photo>(),
                ParticipationRequests = new List<ParticipationRequest>()
            };

            _db.Events.Add(ev);
            // save to get Id
            await _db.SaveChangesAsync();

            // handle tags (will create new Tag entities if needed and link)
            await UpdateEventFromViewModelAsync(ev, vm);

            // save tags/links
            await _db.SaveChangesAsync();

            // handle uploaded photos (if any)
            if (vm.PhotoFiles != null && vm.PhotoFiles.Any())
            {
                await SaveUploadedPhotosAsync(ev.Id, vm.PhotoFiles);
            }

            return RedirectToAction(nameof(Index));
        }

        // -------------------------
        // EDIT (GET)
        // -------------------------
        public async Task<IActionResult> Edit(int id)
        {
            var vm = await ToViewModelAsync(id);
            if (vm == null) return NotFound();
            return View(vm);
        }

        // -------------------------
        // EDIT (POST)
        // -------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, EventEditViewModel vm)
        {
            if (id != vm.Id) return BadRequest();
            if (!ModelState.IsValid) return View(vm);

            var ev = await _db.Events
                .Include(e => e.EventTags!).ThenInclude(et => et.Tag)
                .Include(e => e.Photos)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return NotFound();

            // Update fields and tags
            await UpdateEventFromViewModelAsync(ev, vm);
            await _db.SaveChangesAsync();

            // Save uploaded photos (if provided)
            if (vm.PhotoFiles != null && vm.PhotoFiles.Any())
            {
                await SaveUploadedPhotosAsync(ev.Id, vm.PhotoFiles);
            }

            return RedirectToAction(nameof(Index));
        }

        // -------------------------
        // DETAILS
        // -------------------------
        public async Task<IActionResult> Details(int id)
        {
            var ev = await _db.Events
                .Include(e => e.EventTags!).ThenInclude(et => et.Tag)
                .Include(e => e.Photos)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return NotFound();
            return View(ev);
        }

        // -------------------------
        // DELETE (GET)
        // -------------------------
        public async Task<IActionResult> Delete(int id)
        {
            var ev = await _db.Events.FindAsync(id);
            if (ev == null) return NotFound();
            return View(ev);
        }

        // -------------------------
        // DELETE (POST)
        // -------------------------
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ev = await _db.Events
                .Include(e => e.Photos)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev != null)
            {
                // delete physical photo files
                if (ev.Photos != null)
                {
                    foreach (var p in ev.Photos)
                    {
                        TryDeleteFileFromWwwroot(p.Url);
                    }
                }

                _db.Events.Remove(ev);
                await _db.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Index));
        }

        // -------------------------
        // UPLOAD PHOTOS (standalone action)
        // -------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UploadPhotos(int eventId, List<IFormFile> files)
        {
            if (files == null || files.Count == 0) return RedirectToAction("Edit", new { id = eventId });

            var ev = await _db.Events.FindAsync(eventId);
            if (ev == null) return NotFound();

            await SaveUploadedPhotosAsync(eventId, files);

            return RedirectToAction("Edit", new { id = eventId });
        }

        // -------------------------
        // DELETE PHOTO
        // -------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletePhoto(int id)
        {
            var photo = await _db.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            // remove DB record
            _db.Photos.Remove(photo);
            await _db.SaveChangesAsync();

            // remove file from disk (best effort)
            TryDeleteFileFromWwwroot(photo.Url);

            return RedirectToAction("Edit", new { id = photo.EventId });
        }

        // -------------------------
        // REMOVE TAG (unlink)
        // -------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveTag(int eventId, int tagId)
        {
            var et = await _db.EventTags
                .FirstOrDefaultAsync(x => x.EventId == eventId && x.TagId == tagId);

            if (et != null)
            {
                _db.EventTags.Remove(et);
                await _db.SaveChangesAsync();
            }

            return RedirectToAction("Edit", new { id = eventId });
        }

        // -------------------------
        // ---------- HELPERS ----------
        // -------------------------

        // Map Event -> EventEditViewModel (loads tags & photos)
        private async Task<EventEditViewModel?> ToViewModelAsync(int id)
        {
            var ev = await _db.Events
                .Include(e => e.EventTags!).ThenInclude(et => et.Tag)
                .Include(e => e.Photos)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (ev == null) return null;

            var vm = new EventEditViewModel
            {
                Id = ev.Id,
                Name = ev.Name,
                Description = ev.Description,
                Location = ev.Location,
                LocationUrl = ev.LocationUrl,
                CoverImageUrl = ev.CoverImageUrl,
                EventStartDate = ev.EventStartDate,
                TagsInput = string.Join(", ", ev.EventTags?.Select(et => et.Tag?.Name).Where(n => !string.IsNullOrEmpty(n)) ?? Enumerable.Empty<string>()),
                Photos = ev.Photos?.OrderBy(p => p.Order).Select(p => new PhotoViewModel { Id = p.Id, Url = p.Url, Caption = p.Caption }).ToList() ?? new List<PhotoViewModel>(),
                TagNames = ev.EventTags?.Select(et => et.Tag?.Name ?? "").Where(s => !string.IsNullOrEmpty(s)).ToList() ?? new List<string>()
            };

            return vm;
        }

        // Update Event from ViewModel (update fields, create tags, sync many-to-many)
        private async Task UpdateEventFromViewModelAsync(Event ev, EventEditViewModel vm)
        {
            if (ev == null) throw new ArgumentNullException(nameof(ev));
            if (vm == null) throw new ArgumentNullException(nameof(vm));

            // update scalar fields
            ev.Name = vm.Name;
            ev.Description = vm.Description;
            ev.Location = vm.Location;
            ev.LocationUrl = vm.LocationUrl;
            ev.CoverImageUrl = vm.CoverImageUrl;
            ev.EventStartDate = vm.EventStartDate;

            // parse tags input
            var newTagNames = (vm.TagsInput ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(x => x.Trim())
                .Where(x => x.Length > 0)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();

            // ensure collections are initialized
            ev.EventTags ??= new List<EventTag>();

            // load existing tag entities that match names
            var existingTags = await _db.Tags
                .Where(t => newTagNames.Contains(t.Name))
                .ToListAsync();

            // remove links that are no longer present
            var toRemove = ev.EventTags
                .Where(et => et.Tag != null && !newTagNames.Contains(et.Tag.Name, StringComparer.OrdinalIgnoreCase))
                .ToList();

            foreach (var rem in toRemove)
            {
                ev.EventTags.Remove(rem);
                // optionally: _db.EventTags.Remove(rem);
            }

            // add new links
            foreach (var tagName in newTagNames)
            {
                var alreadyExists = ev.EventTags.Any(et => string.Equals(et.Tag?.Name, tagName, StringComparison.OrdinalIgnoreCase));
                if (alreadyExists) continue;

                var tag = existingTags.FirstOrDefault(t => string.Equals(t.Name, tagName, StringComparison.OrdinalIgnoreCase));
                if (tag == null)
                {
                    // create new Tag
                    tag = new Tag
                    {
                        Name = tagName,
                        Slug = GenerateSlug(tagName)
                    };
                    _db.Tags.Add(tag);
                    existingTags.Add(tag);
                    // do NOT call SaveChanges here — caller will save
                }

                // add linking entity
                ev.EventTags.Add(new EventTag { Event = ev, Tag = tag });
            }
        }

        // Save uploaded photos physically and in DB
        private async Task SaveUploadedPhotosAsync(int eventId, IEnumerable<IFormFile> files)
        {
            if (files == null) return;

            var uploadsRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "events", eventId.ToString());
            if (!Directory.Exists(uploadsRoot)) Directory.CreateDirectory(uploadsRoot);

            foreach (var file in files)
            {
                if (file == null || file.Length <= 0) continue;

                // basic file type check - only accept images (simple check)
                if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)) continue;

                var ext = Path.GetExtension(file.FileName);
                var fileName = $"{Guid.NewGuid()}{ext}";
                var filePath = Path.Combine(uploadsRoot, fileName);

                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }

                var photo = new Photo
                {
                    EventId = eventId,
                    Url = $"/uploads/events/{eventId}/{fileName}",
                    CreatedAt = DateTime.UtcNow
                };

                _db.Photos.Add(photo);
            }

            await _db.SaveChangesAsync();
        }

        // Try to delete a file from wwwroot by its URL (best-effort)
        private void TryDeleteFileFromWwwroot(string url)
        {
            if (string.IsNullOrWhiteSpace(url)) return;

            // url like "/uploads/events/1/abc.jpg"
            var relative = url.TrimStart('/');
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relative.Replace('/', Path.DirectorySeparatorChar));

            try
            {
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }
            }
            catch
            {
                // swallow errors — not critical
            }
        }

        // Simple slug generator (improve for production)
        private string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return string.Empty;
            var slug = text.Trim().ToLowerInvariant();
            slug = slug.Replace(" ", "-");
            // remove any char that's not letter/digit/- (simple)
            var arr = slug.Where(c => char.IsLetterOrDigit(c) || c == '-').ToArray();
            return new string(arr);
        }


        // GET: /Admin/EventsAdmin/Requests?eventId=123
        public async Task<IActionResult> Requests(int eventId)
        {
            var ev = await _db.Events
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (ev == null) return NotFound();

            var requests = await _db.ParticipationRequests
                .Where(r => r.EventId == eventId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            ViewBag.Event = ev;
            return View(requests); // Views/Areas/Admin/Views/EventsAdmin/Requests.cshtml
        }

        // GET: /Admin/EventsAdmin/RequestDetails/5
        public async Task<IActionResult> RequestDetails(int id)
        {
            var req = await _db.ParticipationRequests
                .Include(r => r.Event)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (req == null) return NotFound();
            return View(req); // Views/Areas/Admin/Views/EventsAdmin/RequestDetails.cshtml
        }

        // POST: change status (Approve/Reject)
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangeRequestStatus(int id, ParticipationRequest.ParticipationStatus status)
        {
            var req = await _db.ParticipationRequests.FindAsync(id);
            if (req == null) return NotFound();

            req.Status = status;
            await _db.SaveChangesAsync();

            return RedirectToAction("Requests", new { eventId = req.EventId });
        }

        // POST: delete request
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var req = await _db.ParticipationRequests.FindAsync(id);
            if (req == null) return NotFound();

            var eventId = req.EventId;
            _db.ParticipationRequests.Remove(req);
            await _db.SaveChangesAsync();

            return RedirectToAction("Requests", new { eventId });
        }
    }
}
