using server.Utilities;
namespace server.Dtos
{
    public class BusinessToShowDto
    {
         //[Required]
        public string BName { get; set; }
        //[Required]

        // AMIT QUESTION: do i need bOwner list in front-end?
        public string[] BOwner { get; set; }

        //[Requaierd]
        public string[] BClient{get; set;}
        //[Required]
        public string BMail { get; set; }
        //[Required]
       public string Id { get; set; }
       //[Required]
       public string BType { get; set; }

       public BHome BHome {get; set;}
       public BAbout BAbout{get; set; }

    }
}