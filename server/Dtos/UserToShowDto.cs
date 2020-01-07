namespace server.Dtos
{
    public class UserToShowDto
    {
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
        public string Token { get; set; }
    }
}