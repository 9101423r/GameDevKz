using GameDevKz.Server.Services;
using GameDevKz.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace GameDevKz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController(IEventService service, ILogger<EventsController> logger) : ControllerBase
    {
        private readonly IEventService _service = service;
        private readonly ILogger<EventsController> _logger = logger;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            _logger.LogInformation("Get Event by id");
            try
            {
                var ev = await _service.GetByIdAsync(id);
                return ev == null ? NotFound() : Ok(ev);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error get event by id");
                return StatusCode(500, "Internal server error");
            }
        }

        //[HttpPost]
        //public async Task<IActionResult> Create(EventCreateDto dto)
        //{
        //    var ev = await _service.CreateAsync(dto);
        //    return CreatedAtAction(nameof(Get), new { id = ev.Id }, ev);
        //}

        //[HttpPut("{id}")]
        //public async Task<IActionResult> Update(int id, EventUpdateDto dto)
        //{
        //    var ev = await _service.UpdateAsync(id, dto);
        //    return ev == null ? NotFound() : Ok(ev);
        //}

        //[HttpDelete("{id}")]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var result = await _service.DeleteAsync(id);
        //    return result ? NoContent() : NotFound();
        //}
    }
}
