using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace server.Models
{

    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        private string email;
        private string fName;
        private string lName;
        private string phone;
        private long bDay;
        private string[] type;
        private long lastSeen;
        private byte[] pWordHash;
        private byte[] pWordSalt;

        //contructor of user
        public User(string id = "", string e = "", string f = "", string l = "", string p = "",
                     long b = 0, string[] t = null,long date = 0, byte[] pass= null)
        {
            Id = id;
            email = e;
            fName = f;
            lName = l;
            phone = p;
            bDay = b;
            if(t == null)
                t = new string[1];
            type = t;
            lastSeen = date;
            pWordHash = pass;
            pWordSalt = pass;
        }
        //getters and setters
        public string Email { get => email; set => email = value; }
        public string FName { get => fName; set => fName = value; }
        public string LName { get => lName; set => lName = value; }
        public string Phone { get => phone; set => phone = value; }
        public long BDay { get => bDay; set => bDay = value; }
        public string[] Type { get => type; set => type = value; }
        public long LastSeen {get=> lastSeen; set => lastSeen = value;}
        public byte[] PWordHash { get => pWordHash; set => pWordHash = value; }
        public byte[] PWordSalt { get => pWordSalt; set => pWordSalt = value; }

    }
}