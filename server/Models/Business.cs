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
        private string bMail;
        private string bName;
        private bool bAppointment;
        private bool bGallery;
        private string[] bOwner;
        private string[] bClient;
        private string[] bBlockedList;
        private BHome bHome;
        private BAbout bAbout;
        private bool ownerConnected;

        // contructors of business
        public Business(string id="", string email="", string name="",bool appointment = false,
                        bool gallery = false, string[] owner=null,string[] client= null,
                        string[] blocked = null ,BHome home = null,BAbout about = null,bool connected = false)
        {
            Id = id;
            bMail = email;
            bName = name;
            bAppointment = appointment;
            bGallery = gallery;
            if(owner == null)
                owner = new string[1];
            bOwner = owner;
            if(client == null)
                client = new string[1];
            bClient = client;
            if(blocked == null)
                blocked = new string[1];
            bBlockedList = blocked;
            if(home == null)
                home = new BHome();
            if(about == null)
                about = new BAbout();
            bHome = home;
            bAbout = about;
            ownerConnected = connected;
        }
        //getters and setters
        public string BMail { get => bMail; set => bMail = value; }
        public string BName { get => bName; set => bName = value; }
        public bool BAppointment {get=> bAppointment; set => bAppointment = value; }
        public bool BGallery { get => bGallery; set => bGallery = value; }
        public string[] BOwner { get => bOwner; set => bOwner = value; }
        public string[] BClient { get=> bClient; set => bClient = value; }
        public string[] BBlockedList { get=> bBlockedList; set => bBlockedList = value; }
        public BHome BHome { get => bHome; set => bHome = value; }
        public BAbout BAbout { get => bAbout; set => bAbout = value; }
        public bool OwnerConnected { get => ownerConnected; set => ownerConnected = value; }
    }
}