// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;


using server.Services;
using server.Dtos;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _config;
        //////////////////////////////////////////
        //attaching service to controller
        //////////////////////////////////////////
        public AuthController(UserService userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }
        [AllowAnonymous]
        [HttpPost("register")]
        /////////////////////////////////////////
        //method to create user to register
        /////////////////////////////////////////
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            User newUser = new User();
            foreach (var field in userForRegisterDto.GetType().GetProperties())
            {
                PropertyInfo pi = newUser.GetType().GetProperty(field.Name);
                if (pi != null && field.Name != "PWord") //skipping if field does not exists or it is the password(password wil be generate in hashing in service)
                    if (field.Name == "Type")
                     // helpME must be a better way to set the value
                        newUser.Type = new string[1] { userForRegisterDto.Type };
                    else
                        pi.SetValue(newUser, field.GetValue(userForRegisterDto));
            }
            ///////////////////////////////////////////////////////////////////
            //send user to service with original password entered for hashing
            ///////////////////////////////////////////////////////////////////
            await _userService.Create(newUser, userForRegisterDto.PWord);
            return Ok(newUser);

        }
        //action=name of function, email=what the function gets
        [AllowAnonymous]
        [Route("[action]/{email,pWord}")]
        [HttpPost("GetByEmailPass")]

        ///////////////////////////////////////////
        // method for login by email and password
        ///////////////////////////////////////////
        public async Task<ActionResult<UserToShowDto>> GetByEmailPass([FromQuery] string email, [FromQuery] string pWord)
        {
            Console.WriteLine("EMAIL: {0}/n PASS: {1}", email, pWord);
            UserToShowDto user = new UserToShowDto();
            User u = await _userService.GetAuthUser(email, pWord);
            if (u == null)
                return Unauthorized("error in login");

            /////////////////////////////////////////////
            // copying user to view it
            /////////////////////////////////////////////
            foreach (var field in u.GetType().GetProperties())
            {
                PropertyInfo pi = user.GetType().GetProperty(field.Name);
                if (pi != null)
                    if (field.Name.Equals("Type"))
                    {
                        // helpME must be a better way to get the value
                        pi.SetValue(user, u.Type[0]);
                    }
                    else
                        pi.SetValue(user, field.GetValue(u));
            }
            //////////////////////////////////////
            // genereting token
            //////////////////////////////////////

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256Signature);
            ///////////////////////////////////////
            // token options with 1 hour expiration
            ///////////////////////////////////////
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:5000",
                audience: "http://localhost:5000",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            ////////////////////////////////////////
            //returns token to the loggd-in user
            ////////////////////////////////////////
            user.Token = tokenString;
            return Ok(user);
        }
    }
}
