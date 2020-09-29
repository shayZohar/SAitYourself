using System;
using System.ComponentModel.DataAnnotations;
using server.Utilities;

namespace server.Dtos
{
    public class UserForRegisterDto
    {
        public string Id { get; set; }
        public string FName { get; set; }
        public string LName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public long BDay { get; set; }
        public string Type { get; set; }
        public long LastSeen {get; set;}
        
        //this is required (if somehow it gets passed the front-end, error message still poped-up and block the operation )
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8 characters")]
        public string PWord { get; set; }
        
    }
}
