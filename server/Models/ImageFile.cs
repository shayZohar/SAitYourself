using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using server.Utilities;

namespace server.Models
{
    public class ImageFile
    {
         [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        private string Name{ get; set; }
        private string Owner{ get; set; }

// Constructor
        public ImageFile(string id="", string name="",string owner="")
        {
          Id = id;
          Name = name;
          Owner = owner;
        }

        // Getters & Setters
        public string FileOwner { get => Owner; set => Owner = value; }
        public string FileName { get => Name; set => Name = value; }
    }
}