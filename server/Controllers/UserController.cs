// by shay and amit
using System;
using System.Collections.Generic;
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
            // sort Types
            Array.Sort(user.Type, StringComparer.InvariantCulture);
            foreach (var field in user.GetType().GetProperties())
            {
                PropertyInfo pi = userDto.GetType().GetProperty(field.Name);
                if (pi != null)
                {
                    if (!field.Name.Equals("Type"))
                        pi.SetValue(userDto, field.GetValue(user, null));
                    else
                    {
                        pi.SetValue(userDto, user.Type[0]);
                    }
                }
            }

            return Ok(userDto);
        }

        ///////////////////////////////////
        // getting all users for admin
        /////////////////////////////////
        [HttpPost("getAllUsers")]
        public async Task<ActionResult<User[]>> getAllUsers()
        {
            var users = await _userService.getAllUsers();

            if (users == null)
                return NotFound("no users in system");
            User[] usersArray = users.ToArray();
            return Ok(users);
        }


        //////////////////////////////////
        /// check if user exists by email
        //////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("emailExists")]
        public async Task<ActionResult<Boolean>> emailExists([FromQuery] string email)
        {
            User user = await _userService.TryGetUser(email);
            bool business = await _userService.emailExistsInBusinesses(email);
            if (user == null && !business)
                return Ok(false);
            else
                return Ok(true);
        }

/////////////////////
// getting the user types
////////////////////
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


//////////////////////////////////////
// deleting user specific type
//////////////////////////////////////
        [Route("[action]/{userEmail,typeToDelete}")]
        [HttpPost("deleteType")]
        public async Task<ActionResult<bool>> deleteType([FromQuery] string userEmail, [FromQuery] string typeToDelete)
        {
            bool removed = await _userService.deleteRoll(userEmail, typeToDelete);
            if (removed == true)
                return Ok(true);
            else
                return NotFound("did not delete type");
        }

//////////////////////////////
// deleting specific user
/////////////////////////////

        [Route("[action]/{userEmail}")]
        [HttpPost("deleteUser")]
        public async Task<ActionResult<bool>> deleteUser([FromQuery] string userEmail)
        {
            if (userEmail != null)
            {
                bool deleted = await _userService.deleteUserFromDB(userEmail);
                return Ok(deleted);
            }
            return NotFound("error with data");
        }

///////////////////////////////////////////////
// update user's last seen (login) date
//////////////////////////////////////////////
        [AllowAnonymous]
        [HttpPost("updatedLastSeen")]
        public async Task<ActionResult<bool>> updatedLastSeen(UserToShowDto user)
        {

            bool update = await _userService.updatedLastSeen(user.Email,user.LastSeen);
            return Ok(update);
        }

/////////////////////////////////
// updating user
////////////////////////////////
        [HttpPost("updateUser")]
        public async Task<ActionResult<bool>> updateUser(UserToUpdateDto user)
        {
            User updatedUser = new User();
            foreach (var field in user.GetType().GetProperties())
            {
                PropertyInfo pi = updatedUser.GetType().GetProperty(field.Name);
                if (pi != null && field.Name != "Token" && field.Name != "Type")
                    pi.SetValue(updatedUser, field.GetValue(user));
            }

            bool updated = await _userService.updateUserFromDB(updatedUser);
            return Ok(updated);
        }


///////////////////////////////////
// adding user type to specific user
///////////////////////////////////
        [HttpPost("addType")]
        [Route("[action]/{email,type}")]
        public async Task<ActionResult<UserToShowDto>> addType([FromQuery] string email, [FromQuery] string type)
        {
            var result = await _userService.addType(email, type);

            if (result == null)
                return BadRequest("type was not added");

            UserToShowDto userDto = new UserToShowDto();
            foreach (var field in result.GetType().GetProperties())
            {
                PropertyInfo pi = userDto.GetType().GetProperty(field.Name);
                if (pi != null)
                {
                    if (!field.Name.Equals("Type"))
                        pi.SetValue(userDto, field.GetValue(result, null));
                    else
                    {
                        userDto.Type = "Admin";
                    }
                }
            }
            return Ok(userDto);
        }
    }
}