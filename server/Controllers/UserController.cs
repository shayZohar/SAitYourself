// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using server.Services;
using server.Dtos;
using server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        //////////////////////////////////////////
        //attaching service to controller
        //////////////////////////////////////////
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        //action=name of function, email=what the function gets
        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("GetByEmail")]
        public async Task<ActionResult<UserToShowDto>> GetByEmail([FromQuery] string email)
        {
            User user = await _userService.TryGetUser(email);
            if (user == null)
                return BadRequest("user does not exist");

            UserToShowDto userDto = new UserToShowDto();

            foreach (var field in user.GetType().GetProperties())
            {
                PropertyInfo pi = userDto.GetType().GetProperty(field.Name);
                if (pi != null)
                {
                    if (!field.Name.Equals("Type"))
                        pi.SetValue(userDto, field.GetValue(user, null));
                    else
                        pi.SetValue(userDto, user.Type[0]);
                }
            }

            return Ok(userDto);
        }

        // public async Task<ActionResult<UserToShowDto[]>> GetBusinessClients(string[] emailArray)
        // {
        //     User[] usersArray = await _userService.getUsersList(emailArray).ToArray();
        //     if (usersArray == null)
        //         return NotFound("Business have no clients!");
        //     UserToShowDto[] usersDtoArray = new UserToShowDto[usersArray.GetLength(0)];

        //     for (int i = 0; i < usersArray.GetLength(0); i++ )
        //     {
        //         foreach (var field in usersArray[i].GetType().GetProperties())
        //         {
        //             PropertyInfo pi = usersDtoArray[i].GetType().GetProperty(field.Name);
        //             if (pi != null)
        //             {
        //                 if(!field.Name.Equals("Type"))
        //                     pi.SetValue(usersDtoArray[i], field.GetValue(usersArray[i], null));
        //                 else
        //                     usersDtoArray[i].Type = "Client";

        //             }
        //         }
        //     }
        //     return Ok(usersDtoArray);
        // }
        //////////////////////////////////
        /// check if user exists by email
        //////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("emailExists")]
        public async Task<ActionResult<Boolean>> emailExists([FromQuery] string email)
        {
            User user = await _userService.TryGetUser(email);
            if (user == null)
                return Ok(false);
            else
                return Ok(true);

        }


        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("getUserTypes")]
        public async Task<ActionResult<string[]>> getUserTypes([FromQuery] string email)
        {
            string[] types = await _userService.getRoles(email);
            if (types != null)
                return Ok(types);
            else
                return NotFound("did not found user");
        }
    }
}