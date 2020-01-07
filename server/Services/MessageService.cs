// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using server.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Services
{
    public class MessageService
    {
        private readonly IMongoCollection<Message> _messages;
        /////////////////////////////////////
        //getting collection of messages
        /////////////////////////////////////
        public MessageService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _messages = database.GetCollection<Message>("Messages");
        }

        ///////////////////////////////////////////////
        //inserting new mesage to collection in database
        ///////////////////////////////////////////////
        public async Task<Message> Create(Message message)
        {
            if(message.RecieverId == "")
                message.RecieverId = "amit@gmail.com";
            await _messages.InsertOneAsync(message);
            return message;
        }
        //////////////////////////////////////////
        //get message by its email of reciever
        ///////////////////////////////////////////
        public async Task<Message> TryGetMessage(string messId)
        {
            var filter = new BsonDocument("_id", ObjectId.Parse(messId));
            Message message = await _messages.Find<Message>(filter).FirstOrDefaultAsync();
            return message;
        }

        /////////////////////////////////////////////////////////////////
        //getting a list of all messages recieved  by receiver id
        ////////////////////////////////////////////////////////////////
        public async Task<List<Message>> GetAllRecievedMessages(string recieverId)
        {

            List<Message> messages = await _messages.Find<Message>(m => m.RecieverId == recieverId).ToListAsync();

            return messages;
        }

        /////////////////////////////////////////////////////////////////
        //getting a list of all messages sent  by sender id
        ////////////////////////////////////////////////////////////////
        public async Task<List<Message>> GetAllSentMessages(string senderId)
        {

            List<Message> messages = await _messages.Find<Message>(m => m.SenderId == senderId).ToListAsync();
            return messages;
        }

        ///////////////////////////////////////////////////////////
        // update revieved messages to read=true after plling them from server
        ////////////////////////////////////////////////////////////
        public async Task<Boolean> SetAsReadMesages(string recieverId)
        {
            // var update = Builders<Message>.Update.Set(m => m.Read, "true");

            //  var filter = new BsonDocument("recieverId", recieverId);
            //     var result = await _messages.UpdateManyAsync(
            //                         Builders<Message>.Filter.Eq(m =>m.RecieverId, recieverId),
            //                         Builders<Message>.Update.Set(m => m.Read, "true"));

            //         Console.WriteLine("result is: " + result);
            var builderF = Builders<Message>.Filter;
            var filter = builderF.Eq(m => m.RecieverId, recieverId);
            //new FilterDefinitionBuilder<Message>().Eq(m =>m.RecieverId, recieverId);
            //var update = new UpdateDefinitionBuilder<Message>().Set(m => m.Read, "true");
            var builderU = Builders<Message>.Update;
            var update = builderU.Set("Read", "true");
            var result = await _messages.UpdateManyAsync(filter, update);
            if (result == null)
                return false;
            return true;
        }
        ////////////////////////////////////////
        // deleting message from database by id
        ////////////////////////////////////////
        public async Task<Boolean> DeleteMessage(string messageId)
        {
            
            var filter_id = Builders<Message>.Filter.Eq("_id", ObjectId.Parse(messageId));
            var result =  await _messages.FindOneAndDeleteAsync(filter_id);
            if (result == null)
                return false;
            return true;
        }
        ///////////////////////////////////////////////////////////
        // update message as read=true|false
        ////////////////////////////////////////////////////////////
        public async Task<Boolean> SetmessageAsRead(string messageId,string read)
        {
           
            var builderF = Builders<Message>.Filter;
            var filter = builderF.Eq("_id", ObjectId.Parse(messageId));
            var builderU = Builders<Message>.Update;
            var update = builderU.Set("Read", true);
             if(read=="true"){
                 update = builderU.Set("Read", false);
             } 
             
            var result = await _messages.UpdateOneAsync(filter, update);
            if (result == null)
                return false;
            return true;
        }
       
    }
}