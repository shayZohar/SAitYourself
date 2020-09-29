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
        [Route("[action]/{email,pWord,businessName}")]
        [HttpPost("GetByEmailPass")]

        ///////////////////////////////////////////
        // method for login by email and password
        ///////////////////////////////////////////
        public async Task<ActionResult<UserToShowDto>> GetByEmailPass([FromQuery] string email, [FromQuery] string pWord,[FromQuery] string businessName=null)
        {
            Console.WriteLine("EMAIL: {0}/n PASS: {1}", email, pWord);
            UserToShowDto user = new UserToShowDto();
            User u = await _userService.GetAuthUser(email, pWord,businessName);
            if (u == null){
                return Unauthorized("error in login");
            }
            Array.Sort(u.Type, StringComparer.InvariantCulture);
            /////////////////////////////////////////////
            // copying user to view it
            /////////////////////////////////////////////
            foreach (var field in u.GetType().GetProperties())
            {
                PropertyInfo pi = user.GetType().GetProperty(field.Name);
                if (pi != null)
                    if (field.Name.Equals("Type"))
                    {
                        pi.SetValue(user , u.Type[0]);
                    }
                    else
                        pi.SetValue(user, field.GetValue(u));
            }
                      
            ////////////////////////////////////////
            //returns token to the loggd-in user
            ////////////////////////////////////////
            user.Token = genratingToken();
            return Ok(user);
        }

            //////////////////////////////////////
            // genereting token
            //////////////////////////////////////
        private string genratingToken() {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256Signature);
            ///////////////////////////////////////
            // token options with 1 month expiration
            ///////////////////////////////////////
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:5000",
                audience: "http://localhost:5000",
                claims: new List<Claim>(),
                expires: DateTime.Now.AddMonths(1), 
                signingCredentials: signinCredentials
            );
            return new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        }
    }
}
