using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using server.Utilities;

namespace server.Models
{

    public class Business
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        //[BsonElement("bMail")]
        private string bMail;
        //[BsonElement("bName")]
        private string bName;
        //[BsonElement("bType")]
        private string bType;
       // [BsonElement("bOwner")]
        private string[] bOwner;

        // AMIT
        private string[] bClient;
        private BHome bHome;
        private BAbout bAbout;
        // contructors of business
        public Business(string id="", string email="", string name="", string[] owner=null,string[] client=null, string type="",BHome home = null,BAbout about = null)
        {
            Id = id;
            bMail = email;
            bName = name;
            if(owner == null)
                owner = new string[] {""};
            bOwner = owner;
            if(client == null)
                client = new string[] {""};
            bClient = client;
            bType = type;
            if(home == null)
                home = new BHome();
            if(about == null)
                about = new BAbout();
            bHome = home;
            bAbout = about;
        }
        //getters and setters
        public string BMail { get => bMail; set => bMail = value; }
        public string BName { get => bName; set => bName = value; }

        public string[] BOwner { get => bOwner; set => bOwner = value; }

        // AMIT
        public string[] BClient {get=> bClient; set => bClient = value; }
        public string BType { get => bType; set => bType = value; }
        
        // AMIT
        public BHome BHome { get => bHome; set => bHome = value; }
        public BAbout BAbout { get => bAbout; set => bAbout = value; }
        public static implicit operator bool(Business v)
        {
            throw new NotImplementedException();
        }
    }
}