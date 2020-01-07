// by shay and amit
using System.ComponentModel.DataAnnotations;
using server.Utilities;
namespace server.Dtos
{
    public class BusinessForRegisterDto
    {
        //[Required]
        public string Id { get; set; }
        //[Required]
        public string BName { get; set; }
        //[Required]
        public string BOwner { get; set; }
        //[Required]
        public string BMail { get; set; }
        //[Required]
         public string BType { get; set; }
        //[Required]

        public BHome BHome { get; set; }
       
    }
}