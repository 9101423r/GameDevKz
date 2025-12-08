using GameDevKz.Server.Services;
using GameDevKz.Server.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace GameDevKz.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestParticipiantController : ControllerBase
    {
        private readonly IParticipiantService _service;

        public RequestParticipiantController(IParticipiantService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(ParticipiantCreateDto dto)
        {
            var request = await _service.CreateAsync(dto);
            return Ok(request);
        }
    }
}
