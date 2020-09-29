namespace server.Dtos
{
    public class MessageToShowDto
    {
        public string RecieverId { get; set; }
        public string SenderId { get; set; }
        public string SubJect { get; set; }
       public string Id { get; set; }
       public string MessContent { get; set; }
       public bool Read { get; set; }
       public string Date{ get; set;}
    }
}