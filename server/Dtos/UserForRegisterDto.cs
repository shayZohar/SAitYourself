using System.ComponentModel.DataAnnotations;

namespace server.Dtos
{
    public class UserForRegisterDto
    {
        //[Required]
        public string Id { get; set; }
        //[Required]
        public string FName { get; set; }
        //[Required]
        public string LName { get; set; }
        //[Required]
        public string Email { get; set; }
        //[Required]
        public string Phone { get; set; }
        //[Required]
        public string BDay { get; set; }
        //[Required]
        public string Type { get; set; }
        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "You must specify password between 4 and 8 characters")]
        public string PWord { get; set; }
        
    }
}
