namespace server.Dtos
{
    public class MessageToShowDto
    {
         //[Required]
        public string RecieverId { get; set; }
        //[Required]
        public string SenderId { get; set; }
        //[Required]
        public string SubJect { get; set; }
        //[Required]
       public string Id { get; set; }
       //[Required]
       public string MessContent { get; set; }
       public bool Read { get; set; }
       public string Date{ get; set;}
        // public string Kuku1 {get; set;}
        //  public string kuku2 {get; set;}

    }
}