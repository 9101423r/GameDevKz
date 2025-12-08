using GameDevKz.Server.Services;
using GameDevKz.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace GameDevKz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _service;

        public EventsController(IEventService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var ev = await _service.GetByIdAsync(id);
            return ev == null ? NotFound() : Ok(ev);
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
