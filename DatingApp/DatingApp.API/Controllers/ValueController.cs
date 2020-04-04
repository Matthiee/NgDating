using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValueController : ControllerBase
    {
        private readonly DataContext context;

        public ValueController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetValues()
        {
            return Ok(await this.context.Values.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetValues(int id)
        {
            return Ok(await this.context.Values.FirstOrDefaultAsync(v => v.Id == id));
        }
    }
}