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
        // [BsonElement("fName")]
        private string fName;
        // [BsonElement("lName")]
        private string lName;
        // [BsonElement("phone")]
        private string phone;
        // [BsonElement("bDay")]
        private string bDay;
        // [BsonElement("type")]
        private string[] type;

        //[BsonElement("pWordHash")]
        private byte[] pWordHash;
        // [BsonElement("pWordSalt")]
        private byte[] pWordSalt;

        //contructor of user
        public User(string id = "", string e = "", string f = "", string l = "", string p = "", string b = "", string[] t = null, byte[] pass= null)
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
            pWordHash = pass;
            pWordSalt = pass;
        }
        //getters and setters
        public string Email { get => email; set => email = value; }
        public string FName { get => fName; set => fName = value; }
        public string LName { get => lName; set => lName = value; }
        public string Phone { get => phone; set => phone = value; }
        public string BDay { get => bDay; set => bDay = value; }
        public string[] Type { get => type; set => type = value; }
        public byte[] PWordHash { get => pWordHash; set => pWordHash = value; }
        //public string Id { get => Id; set => Id = value; }
        public byte[] PWordSalt { get => pWordSalt; set => pWordSalt = value; }

    }
}