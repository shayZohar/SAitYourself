using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models
{
    
   public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        private string recieverId;
         private string senderId;
         private string subJect;
         private string messContent;
         private bool read;
         private string date;
         private bool deleted;
     
     //contructor of user
        public Message(string id="",string r="",string s="",string sub="",string c="",bool read=false,string d="",bool del = false)
        {
            Id=id;
            recieverId=r;
            senderId=s;
            subJect=sub;
            messContent=c;
            this.read=read;
            date=d;
            deleted = del;       
        }
        //getters and setters
        public string RecieverId { get => recieverId; set => recieverId = value; }
         public string SenderId { get => senderId; set => senderId = value; }
         public string SubJect { get => subJect; set => subJect = value; }
         public string MessContent { get => messContent; set => messContent = value; }
         public bool Read { get => read; set => read = value; }
         public string Date { get => date; set => date = value; }
         public bool Deleted { get => deleted; set => deleted = value; }
    }
}