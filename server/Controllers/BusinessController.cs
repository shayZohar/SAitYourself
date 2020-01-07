// by shay and amit
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
                        newB.BOwner[0] = business.BOwner;
                    else
                        pi.SetValue(newB, field.GetValue(business));
                }
            }

            ///////////////////////////////////////////////////////////////////
            //send business to service 
            ///////////////////////////////////////////////////////////////////
            await _businessService.Create(newB);
            return Ok(newB);
        }
        //action=name of function, email=what the function gets
        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("GetByEmail")]
        ////////////////////////////////////
        //geting one business
        ////////////////////////////////////
        public async Task<ActionResult<BusinessToShowDto>> GetByEmail([FromQuery] string email)
        {
            BusinessToShowDto business = new BusinessToShowDto();
            Business b = await _businessService.TryGetBusiness(email);
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
        /// check if business exists by email
        //////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{email}")]
        [HttpPost("emailExists")]
        public async Task<ActionResult<Boolean>> emailExists([FromQuery] string email)
        {
            Business business = await _businessService.TryGetBusiness(email);
            if (business == null)
                return Ok(false);
            else
                return Ok(true);

        }
        ////////////////////////////////////////
        // geting all businesses for user search
        ////////////////////////////////////////
        [Route("[action]/email")]
        [HttpPost("GetBusinesses")]
        [AllowAnonymous]
        public async Task<ActionResult<BusinessToShowDto[]>> GetBusinesses(string email = null)
        {
            // AMIT
            List<Business> businesses = await _businessService.GetAllBusinesses(email);
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

        [Route("[action]/{email}")]
        [HttpPost("getUserBusinesses")]
        public async Task<ActionResult<BusinessToShowDto[]>> getUserBusinesses([FromQuery] string email) {
            List<Business> result = await _businessService.GetUserBusinesses(email);
            if (result == null)
                return NotFound("your are not registerd to a business");
            Business[] businessArray = result.ToArray();
            BusinessToShowDto[] businessToShow = new BusinessToShowDto[businessArray.GetLength(0)];
            // AMIT helpME question: maybe write the function in the DTO so ther will be no need to repeat all the time
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

        // AMIT
        [AllowAnonymous]
        [Route("[action]/{business}")]
        [HttpPost("updateBHome")]

        public async Task<ActionResult<BHome>> updateBHome(BusinessHomeUpdateDto business)
        {
            {
                var result = await _businessService.updateHomeVal(business.BHome, business.BMail);
                if (result == false)
                    return NotFound("home did not updated");
                return Ok(business.BHome);
            }
        }

         [AllowAnonymous]
        [Route("[action]/{business}")]
        [HttpPost("updateBAbout")]

        public async Task<ActionResult<BHome>> updateBAbout(BusinessAboutUpdateDto business)
        {
            {
                var result = await _businessService.updateAboutVal(business.BAbout, business.BMail);
                if (result == false)
                    return NotFound("About did not updated");
                return Ok(business.BAbout);
            }
        }
    }
}