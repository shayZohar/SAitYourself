using server.Utilities;
namespace server.Dtos
{
    public class BusinessToShowDto
    {
       public string Id { get; set; }
        public string BName { get; set; }
        public string[] BOwner { get; set; }
        public string[] BClient{get; set;}
        public string BMail { get; set; }
        public bool BAppointment{ get; set; }
        public bool BGallery{ get; set; }
       public BHome BHome {get; set;}
       public BAbout BAbout{get; set;}
       public bool OwnerConnected{get;set;}

    }
}