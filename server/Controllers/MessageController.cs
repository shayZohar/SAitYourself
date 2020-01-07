// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using server.Services;
using server.Models;
using Microsoft.AspNetCore.Authorization;
using server.Dtos;
using System.Reflection;

namespace server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly MessageService _messageService;
        //////////////////////////////////////////
        //attaching service to controller
        //////////////////////////////////////////
        public MessageController(MessageService messageService)
        {
            _messageService = messageService;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        /////////////////////////////////////////
        //method to create message to send to server
        /////////////////////////////////////////
        public async Task<IActionResult> Register(MessageToShowDto messageToShow)
        {
            Message message = new Message();
            Console.WriteLine(message.RecieverId);
            foreach (var field in messageToShow.GetType().GetProperties())
            {
                PropertyInfo pi = message.GetType().GetProperty(field.Name);
                pi.SetValue(message, field.GetValue(messageToShow));
            }
            ////////////////////////////
            //send message to service 
            ////////////////////////////
            await _messageService.Create(message);
            return Ok(message);

        }
        //action=name of function, email=what the function gets
        [AllowAnonymous]
        [Route("[action]/{recieverId}")]
        [HttpPost("GetByEmail")]
        public async Task<ActionResult<Message>> GetByEmail([FromQuery] string recieverId)
        {

            Message message = await _messageService.TryGetMessage(recieverId);

            if (message == null)
                return BadRequest("Message does not exist");
            else
                return Ok(message);
        }
        ////////////////////////////////////////
        // geting all recieved messages for user 
        ////////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{recieverId}")]
        [HttpPost("GetMessages")]
        public async Task<ActionResult<MessageToShowDto[]>> GetMessages([FromQuery]string recieverId)
        {
            List<Message> m = await _messageService.GetAllRecievedMessages(recieverId);
            if (m == null)
                return NotFound("No Messages found in the database");
            Message[] mArray = m.ToArray();

            MessageToShowDto[] mToShow = new MessageToShowDto[mArray.GetLength(0)];

            for (int i = 0; i < mArray.GetLength(0); i++)
            {
                mToShow[i] = new MessageToShowDto();
                foreach (var field in mArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = mToShow[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                        pi.SetValue(mToShow[i], field.GetValue(mArray[i]));
                }
            }
            return Ok(mToShow);
        }

        ////////////////////////////////////////
        // geting all recieved messages for user 
        ////////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{senderId}")]
        [HttpPost("GetSentMessages")]
        public async Task<ActionResult<MessageToShowDto[]>> GetSentMessages([FromQuery]string senderId)
        {
            List<Message> messArr = await _messageService.GetAllSentMessages(senderId);
            if (messArr == null)
                return NotFound("No Messages found in the database");
            Message[] mArray = messArr.ToArray();

            MessageToShowDto[] mToShow = new MessageToShowDto[mArray.GetLength(0)];

            for (int i = 0; i < mArray.GetLength(0); i++)
            {
                mToShow[i] = new MessageToShowDto();
                foreach (var field in mArray[i].GetType().GetProperties())
                {
                    PropertyInfo pi = mToShow[i].GetType().GetProperty(field.Name);
                    if (pi != null)
                        pi.SetValue(mToShow[i], field.GetValue(mArray[i]));
                }
            }
            return Ok(mToShow);
        }
        ///////////////////////////////////////////////
        // updating field read to "true" in collection
        ///////////////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{recieverId}")]
        [HttpPost("SetAsRead")]
        public async Task<ActionResult<Boolean>> SetAsRead([FromQuery]string recieverId)
        {
            var result = await _messageService.SetAsReadMesages(recieverId);
            if (result == false)
                return NotFound("No Messages updated in the database");

            return Ok(true);
        }
        ////////////////////////////////////
        // removing message from collection
        ////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{messageId}")]
        [HttpPost("RemoveMessage")]
        public async Task<ActionResult<Boolean>> RemoveMessage([FromQuery]string messageId)
        {
            var result = await _messageService.DeleteMessage(messageId);
            if (result == false)
                return NotFound("No Messages removed from the database");
            
            return Ok(true);
        }
        ///////////////////////////////////////////////////////
        // updating field read to "true" or "false" in message
        ///////////////////////////////////////////////////////
        [AllowAnonymous]
        [Route("[action]/{messageId,read}")]
        [HttpPost("SetReadMessage")]
        public async Task<ActionResult<Boolean>> SetReadMessage([FromQuery]string messageId, [FromQuery]string read)
        {
            var result = await _messageService.SetmessageAsRead(messageId,read);
            if (result == false)
                return NotFound("Message was not updated in the database");

            return Ok(true);
        }
       
    }
}
