using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    
   public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

       // [BsonElement("recieverId")]
        private string recieverId;
        // [BsonElement("senderId")]
         private string senderId;
        //  [BsonElement("subJect")]
         private string subJect;
       //   [BsonElement("messContent")]
         private string messContent;
       //  [BsonElement("read")]
         private bool read;
         private string date;
     

     //contructor of user
        public Message(string id="",string r="",string s="",string sub="",string c="",bool read=false,string d="")
        {
            Id=id;
            recieverId=r;
            senderId=s;
            subJect=sub;
            messContent=c;
            this.read=read;
            date=d;
            
        }
        //getters and setters
        public string RecieverId { get => recieverId; set => recieverId = value; }
         public string SenderId { get => senderId; set => senderId = value; }
         public string SubJect { get => subJect; set => subJect = value; }
         public string MessContent { get => messContent; set => messContent = value; }
         public bool Read { get => read; set => read = value; }
         public string Date { get => date; set => date = value; }
    }
}