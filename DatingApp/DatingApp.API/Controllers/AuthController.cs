using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository auth;

        public AuthController(IAuthRepository auth)
        {
            this.auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserForRegisterDto userDto)
        {
            userDto.Username = userDto.Username.ToLowerInvariant();

            if (await auth.UserExists(userDto.Username))
                return BadRequest();

            var user = new User()
            {
                Username = userDto.Username
            };

            user = await auth.Register(user, userDto.Password);

            if (user is null)
                return BadRequest();

            return StatusCode(201); // to be fixed later
        }


    }
}