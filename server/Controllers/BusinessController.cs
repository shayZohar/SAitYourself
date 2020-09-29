
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using server.Services;
using server.Utilities;
using server.Dtos;
using server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BusinessController : ControllerBase
    {
        private readonly BusinessService _businessService;
        //////////////////////////////////////////
        //attaching service to controller
        //////////////////////////////////////////
        public BusinessController(BusinessService businessService)
        {
            _businessService = businessService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        /////////////////////////////////////////
        // method to create business to register
        /////////////////////////////////////////
        public async Task<IActionResult> Register(BusinessForRegisterDto business)
        {
            // AMIT helpME still need to check later if business already exists
            Business newB = new Business();
            Console.WriteLine(business.BHome);
            foreach (var field in business.GetType().GetProperties())
            {
                PropertyInfo pi = newB.GetType().GetProperty(field.Name);
                if (pi != null)
                { //skipping if field does not exists
                    if (field.Name.Equals("BOwner"))
                        newB.BOwner[0] = business.BOwner[0];
                    else
                        pi.SetValue(newB, field.GetValue(business));
                }
            }

            ///////////////////////////////////////////////////////////////////
            //send business to service 
            ///////////////////////////////////////////////////////////////////
            await _businessService.Create(newB);
            Appointment app = new Appointment();
            app.BName = newB.BName;
            await _businessService.setAppointment(app);
            return Ok(newB);
        }
        //action=name of function, email=what the function gets
        [AllowAnonymous]
        [Route("[action]/{name}")]
        [HttpPost("GetByEmail")]
        ////////////////////////////////////
        //geting one business
        ////////////////////////////////////
        public async Task<ActionResult<BusinessToShowDto>> GetByName([FromQuery] string name)
        {
            BusinessToShowDto business = new BusinessToShowDto();
            Business b = await _businessService.TryGetBusiness(name);
            if (b == null)
                return NotFound("No business found");
            foreach (var field in b.GetType().GetProperties())
            {
                PropertyInfo pi = business.GetType().GetProperty(field.Name);
                if (pi != null)
                    pi.SetValue(business, field.GetValue(b));
            }
            return Ok(business);
        }

        //////////////////////////////////
        /// check if business exists by name
        /// this is for user to register only unique business name
        //////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/businessName")]
        [HttpPost("nameExists")]
        public async Task<ActionResult<bool>> nameExists([FromQuery] string businessName)
        {
            Business business = await _businessService.TryGetBusiness(businessName);
            if (business == null)
                return Ok(false);
            else
                return Ok(true);

        }


        ///////////////////////////////////////////
        /// check if specific business email exists' to avoid double same emails in the system
        ///////////////////////////////////////////// 
        [AllowAnonymous]
        [Route("[action]/businessEmail")]
        [HttpPost("emailExists")]
        public async Task<ActionResult<bool>> emailExists([FromQuery] string businessEmail)
        {
            bool exists = await _businessService.emailExists(businessEmail);
            return Ok(exists);

        }

        ////////////////////////////////////////
        // geting all businesses for user search
        ////////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{email,type}")]
        [HttpPost("GetBusinesses")]
        public async Task<ActionResult<BusinessToShowDto[]>> GetBusinesses([FromQuery] string email = null, [FromQuery] string type = null)
        {

            List<Business> businesses = await _businessService.GetAllBusinesses(email, type);
            if (businesses == null)
                return NotFound("No businesses found in the database");
            Business[] bArray = businesses.ToArray();
            BusinessToShowDto[] bToShow = new BusinessToShowDto[bArray.GetLength(0)];

            for (int i = 0; i < bArray.GetLength(0); i++)
            {
                bToShow[i] = new BusinessToShowDto();
                foreach (var field in bArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = bToShow[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                        pi.SetValue(bToShow[i], field.GetValue(bArray[i]));
                }
            }
            return Ok(bToShow);
        }

        ////////////////////////////////////////////
        // adding new owner to specific business
        //////////////////////////////////////////
        [Route("[action]/{businessName,newOwner}")]
        [HttpPost("AddNewOwner")]
        public async Task<ActionResult<User>> AddNewOwner([FromQuery] string businessName, [FromQuery] string newOwner)
        {
            var owner = await _businessService.addUserToBusiness(businessName, newOwner, "Business Owner");
            if (owner == null)
                return BadRequest("owner did not added to business");
            return Ok(owner);
        }

        ///////////////////////////////////////
        // adding client to specific business
        ////////////////////////////////////////
        [Route("[action]/{businessName,newClient}")]
        [HttpPost("addNewClient")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> addNewClient([FromQuery] string businessName, [FromQuery] string newClient)
        {
            var client = await _businessService.addUserToBusiness(businessName, newClient, "Client");
            if (client == null)
                return BadRequest("client did not added to business");
            return Ok(client);
        }

        ///////////////////////////////////////
        // getting all of business owners
        //////////////////////////////////////
        [Route("[action]/{email}")]
        [HttpPost("getOwnersBusinesses")]
        public async Task<ActionResult<BusinessToShowDto[]>> getOwnersBusinesses([FromQuery] string email)
        {
            List<Business> result = await _businessService.GetOwnerBusiness(email);
            if (result == null)
                return NotFound("No businesses for business owner");
            Business[] businessesArray = result.ToArray();
            BusinessToShowDto[] businessDtoArray = new BusinessToShowDto[businessesArray.GetLength(0)];

            for (int i = 0; i < businessesArray.GetLength(0); i++)
            {
                businessDtoArray[i] = new BusinessToShowDto();
                foreach (var field in businessesArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = businessDtoArray[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                        pi.SetValue(businessDtoArray[i], field.GetValue(businessesArray[i]));
                }
            }

            return Ok(businessDtoArray);
        }

        //////////////////////////////////////
        // get list of all businesses user is registered to
        //////////////////////////////////////////
        [Route("[action]/{email}")]
        [HttpPost("getUserBusinesses")]
        public async Task<ActionResult<BusinessToShowDto[]>> getUserBusinesses([FromQuery] string email)
        {
            List<Business> result = await _businessService.GetUserBusinesses(email);
            if (result == null)
                return NotFound("your are not registerd to a business");
            Business[] businessArray = result.ToArray();
            BusinessToShowDto[] businessToShow = new BusinessToShowDto[businessArray.GetLength(0)];
            for (int i = 0; i < businessArray.GetLength(0); i++)
            {
                businessToShow[i] = new BusinessToShowDto();
                foreach (var field in businessArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = businessToShow[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                        pi.SetValue(businessToShow[i], field.GetValue(businessArray[i]));
                }
            }
            return Ok(businessToShow);
        }

        /////////////////////////////////////
        // updating business home page content
        //////////////////////////////////////
        [Route("[action]/{business}")]
        [HttpPost("updateBHome")]

        public async Task<ActionResult<BHome>> updateBHome(BusinessHomeUpdateDto business)
        {
            {
                var result = await _businessService.updateHomeVal(business.BHome, business.BName);
                if (result == false)
                    return NotFound("home did not updated");
                return Ok(business.BHome);
            }
        }

        ///////////////////////////////
        // updating about page content
        //////////////////////////////
        [Route("[action]/{business}")]
        [HttpPost("updateBAbout")]

        public async Task<ActionResult<BAbout>> updateBAbout(BusinessAboutUpdateDto business)
        {
            {
                var result = await _businessService.updateAboutVal(business.BAbout, business.BName);
                if (result == false)
                    return NotFound("About did not updated");
                return Ok(business.BAbout);
            }
        }

        ////////////////////////////////////
        // getting list of users of business
        ////////////////////////////////////
        [Route("[action]/{businessName,mongoField}")]
        [HttpPost("GetBusinessUsers")]
        public async Task<ActionResult<UserToShowDto[]>> GetBusinessUsers([FromQuery] string businessName, [FromQuery] string mongoField)
        {
            List<User> usersList = await _businessService.getUserstList(businessName, mongoField);
            if (usersList == null)
                return NotFound("error in getting users of business");
            User[] usersArray = usersList.ToArray();
            UserToShowDto[] usersDtoArray = new UserToShowDto[usersArray.GetLength(0)];

            for (int i = 0; i < usersArray.GetLength(0); i++)
            {
                usersDtoArray[i] = new UserToShowDto();
                foreach (var field in usersArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = usersDtoArray[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                    {
                        if (!field.Name.Equals("Type"))
                            pi.SetValue(usersDtoArray[i], field.GetValue(usersArray[i], null));
                        else
                            usersDtoArray[i].Type = "Client";
                    }
                }
            }
            return Ok(usersDtoArray);
        }

        //////////////////////////
        // unblocking user from logging-in to business
        ///////////////////////////////
        [Route("[action]/{businessName,user}")]
        [HttpPost("unBlockUser")]

        public async Task<ActionResult<bool>> unBlockUser([FromQuery] string businessName, [FromQuery] string user)
        {
            var result = await _businessService.unBlockFromBusiness(businessName, user);
            if (result == false)
                return BadRequest("could not unBlock user");
            return Ok(true);

        }
        ////////////////////////////////////
        // remove a client from business list
        ////////////////////////////////////
        [Route("[action]/{businessName,client}")]
        [HttpPost("removeClient")]

        public async Task<ActionResult<bool>> removeClient([FromQuery] string businessName, [FromQuery] string client)
        {
            var result = await _businessService.removeFromBusiness(businessName, client, false);
            if (result == false)
                return BadRequest("could not remove user");
            return Ok(true);
        }

        //////////////////////////////
        // removing owner from business
        //////////////////////////////
        [Route("[action]/{businessName,ownerToRemove}")]
        [HttpPost("removeOwner")]
        public async Task<ActionResult<bool>> removeOwner([FromQuery] string businessName, [FromQuery] string owner)
        {
            var result = await _businessService.removeOwnerFromBusiness(businessName, owner);
            if (result == false)
                return BadRequest("could not remove Owner");
            return Ok(true);
        }

        ////////////////////////////////////
        // a method to remove a client from business list and add him
        // to the blocked list
        ////////////////////////////////////
        [Route("[action]/{businessName,client}")]
        [HttpPost("blockClient")]
        public async Task<ActionResult<bool>> blockClient([FromQuery] string businessName, [FromQuery] string client)
        {
            var result = await _businessService.removeFromBusiness(businessName, client, true);
            if (result == false)
                return BadRequest("could not block user");
            return Ok(true);
        }

////////////////////////////////
// deleting specific business
////////////////////////////////
        [Route("[action]/{businessName,user,requestFrom}")]
        [HttpPost("deleteBusiness")]
        public async Task<ActionResult<bool>> deleteBusiness([FromQuery] string businessName, [FromQuery] string user, [FromQuery] string requestFrom)
        {
            bool result;
            if (requestFrom.Equals("Admin"))//if request is by admin, delete from database
                result = await _businessService.deletedByAdmin(businessName);
            else // if not by admin, just remove the owner who request it from business owner list
                result = await _businessService.removeOwnerFromBusiness(businessName, user);

            if(result == false)
                return BadRequest("Business was not deleted");
            return Ok(result);
        }
        [AllowAnonymous]
        [HttpPost("SetAppointments")]
        ////////////////////////////////////
        //setting appointment list
        ////////////////////////////////////
        public async Task<ActionResult<Appointment>> setAppointments(Appointment app)
        {
            await _businessService.setAppointment(app);
            return Ok(app);
        }

        //////////////////////////////////
        /// getting appoinemt list of business
        //////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{name}")]
        [HttpPost("GetAppointment")]
        public async Task<ActionResult<Appointment>> getAppointment([FromQuery] string name)
        {
            Appointment app = await _businessService.GetAppointment(name);
            return Ok(app);

        }

///////////////////////////////
// updating settings fields of business
////////////////////////////////////
        [HttpPost("updateBoolFields")]
        public async Task<ActionResult<bool>> updateBoolFields(boolUpdate update)
        {
            bool result = false;
            if (update.MongoField.Equals("BAppointment"))
                result = await _businessService.updateApp(update.ValueToUpdate, update.KeyToUpdate);
            else if (update.MongoField.Equals("BGallery"))
                result = await _businessService.updateGallery(update.ValueToUpdate, update.KeyToUpdate);
            else if (update.MongoField.Equals("OwnerConnected"))
                if (update.ValueToUpdate == true)
                    // connecting to Business
                    result = await _businessService.connectOwner(update.KeyToUpdate);
                else
                    // dissconecting from business
                    result = await _businessService.disconnectOwner(update.KeyToUpdate);
            if (result || update.MongoField.Equals("OwnerConnected"))
                return Ok(result);
            return BadRequest("did not update");
        }
    }
}