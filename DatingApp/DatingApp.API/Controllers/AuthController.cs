﻿using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dto;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository auth;
        private readonly IConfiguration configuration;
        private readonly IMapper mapper;

        public AuthController(IAuthRepository auth, IConfiguration configuration, IMapper mapper)
        {
            this.auth = auth;
            this.configuration = configuration;
            this.mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userDto)
        {
            userDto.Username = userDto.Username.ToLowerInvariant();

            if (await auth.UserExists(userDto.Username))
                return BadRequest();

            var user = mapper.Map<User>(userDto);

            user = await auth.Register(user, userDto.Password);

            if (user is null)
                return BadRequest();

            var userToReturn = mapper.Map<UserForListDto>(user);

            return CreatedAtRoute("GetUser", new { controller = "Users", id = user.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userDto)
        {
            userDto.Username = userDto.Username.ToLowerInvariant();

            var user = await auth.Login(userDto.Username, userDto.Password);

            if (user is null)
                return Unauthorized();

            var claims = new[] 
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var descriptor = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(descriptor);

            var userToReturn = mapper.Map<UserForListDto>(user);

            return Ok(new 
            {
                token = tokenHandler.WriteToken(token),
                user = userToReturn
            }); 
        }
    }
}