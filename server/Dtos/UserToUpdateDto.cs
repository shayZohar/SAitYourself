using server.Utilities;
namespace server.Dtos
{
    public class UserToUpdateDto
    {
      public string FName { get; set; }
        public string LName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public long BDay { get; set; }
        public long LastSeen {get; set;}
        public string Token { get; set; }
         public string Type { get; set; }
        public string PWord { get; set; }
    }
}