// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using server.Models;
using server.Utilities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Business> _business;
        private readonly IMongoCollection<Message> _messages;

        /////////////////////////////////////
        //getting collection of users
        /////////////////////////////////////
        public UserService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _users = database.GetCollection<User>("user");
            _business = database.GetCollection<Business>("Businesses");
            _messages = database.GetCollection<Message>("Messages");
        }

        ///////////////////////////////////////////////
        //inserting new user to collection in database
        ///////////////////////////////////////////////
        public async Task<User> Create(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PWordHash = passwordHash;
            user.PWordSalt = passwordSalt;
            await _users.InsertOneAsync(user);
            return user;
        }
        ///////////////////////////////////////////////
        //creating password hash by two layers
        ///////////////////////////////////////////////
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        /////////////////////////////////////
        // get list of all users
        ///////////////////////////////
        public async Task<List<User>> getAllUsers()
        {
            FilterDefinition<User> filter = Builders<User>.Filter.AnyNe("Type", "Admin");
            List<User> usersList = await _users.Find<User>(filter).ToListAsync();
            return usersList;
        }


        /////////////////////////////////////////////////////////////////////////
        // get user by its email,used to check if user already exists in database
        /////////////////////////////////////////////////////////////////////////
        public async Task<User> TryGetUser(string email)
        {
            var filter = new BsonDocument("Email", email);
            User user = await _users.Find<User>(filter).FirstOrDefaultAsync();
            return user;
        }

        public async Task<bool> emailExistsInBusinesses(string email) {
            Business business = await _business.Find<Business>(b => b.BMail.Equals(email)).FirstOrDefaultAsync();
            return business != null;
        }

        //////////////////////////////////////////////////
        //veryfing user in log in by email and password
        //////////////////////////////////////////////////
        public async Task<User> GetAuthUser(string email, string pWord, string businessName = null)
        {
            User user = await _users.Find<User>(u => u.Email.Equals(email)).FirstOrDefaultAsync();
            if (user == null)
                return null;
            ///////////////////////////////////////////
            // checking if the password is correct
            ///////////////////////////////////////////
            if (!VerifyPasswordHash(pWord, user.PWordHash, user.PWordSalt))
                return null;
            Business business = null;
            //////////////////////////////////////////
            // checking if user need to be registered to business or not
            //////////////////////////////////////////
            if (businessName != null)
            {
                // yes, so check business exists
                business = await _business.Find<Business>(b => b.BName.Equals(businessName)).FirstOrDefaultAsync();
                if (business == null)
                    // no business
                    return null;
                string type;
                bool owner = business.BOwner.Contains(email);
                bool client = business.BClient.Contains(email);
                if (owner || (!client && user.Type.Contains("Business Owner")))
                    type = "Business Owner";
                else if (client || (!owner && user.Type.Contains("Client")))
                    type = "Client";
                else
                    type = user.Type[0];
                user.Type = new string[] { type };

            }
            return user;
        }
        ///////////////////////////////////////////////////////
        //method to verify password hash
        //////////////////////////////////////////////////////
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                    if (computedHash[i] != passwordHash[i])
                        return false;
                return true;
            }

        }

        //////////////////////////////////////
        // gets roles (type) of user
        ////////////////////////////////////
        public async Task<string[]> getRoles(string email)
        {
            var builderf = Builders<User>.Filter;
            var filter = builderf.Eq("Email", email);
            var choice = Builders<User>.Projection.Include("Type").Exclude("_id");
            var result = await _users.Find<User>(filter).Project<User>(choice).FirstOrDefaultAsync();
            if (result != null)
                return result.Type;
            return null;
        }

        //////////////////////////////
        // delete role of user
        ///////////////////////////
        public async Task<bool> deleteRoll(string userEmail, string typeToDelete)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Email", userEmail) &  Builders<User>.Filter.In("Type", typeToDelete);
            var update = Builders<User>.Update.Pull("Type", typeToDelete);
            UpdateResult result = await _users.UpdateOneAsync(filter, update);
            if (result.MatchedCount == result.ModifiedCount)
                return true;
            return false;
        }

        //////////////////////////////////
        // delete user from database
        ///////////////////////////////////
        public async Task<bool> deleteUserFromDB(string userToDelete)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Email", userToDelete);
            bool business = await this.deleteUserFromBusinesses(userToDelete);
            bool user = false;
            if (business)
            {
                DeleteResult deleteRersult = await _users.DeleteOneAsync(filter);
                user = deleteRersult.IsAcknowledged;
            }

            return user && business;
        }


        ///////////////////////////////////////////////////////////////////////////
        // deleting user from businesses as owner and client when deleting user
        //////////////////////////////////////////////////////////////////////////
        public async Task<bool> deleteUserFromBusinesses(string userToDelete)
        {
            bool owner = await this.removeOwnerFromBusiness(userToDelete);
            bool client = await this.deleteClientFromBusinesses(userToDelete);
            return owner && client;
        }

        ///////////////////////////////////////
        // removing owner from business owner list
        ///////////////////////////////////////
        public async Task<bool> removeOwnerFromBusiness(string owner)
        {
            var builderF = Builders<Business>.Filter;
            var filter = builderF.AnyEq("BOwner", owner);
            List<Business> businessList = await _business.Find<Business>(filter).ToListAsync();
            if (businessList.Count > 0)
            {
                // making new filters
                FilterDefinition<Business> deleteFilter = null;
                FilterDefinition<Business> removeFilter = null;
                UpdateDefinition<Business> update;
                // a loop ko builed bowth filers, for delete &
                for (int i = 0; i < businessList.Count; i++)
                {
                    if (businessList[i].BOwner.GetLength(0) <= 1)
                        // filtering businesses to delete
                        deleteFilter = deleteFilter == null ? builderF.Eq("BName", businessList[i].BName) :
                         deleteFilter | builderF.Eq("BName", businessList[i].BName);
                    else
                        // filtering businesses to remove
                        removeFilter = removeFilter == null ? builderF.Eq("BName", businessList[i].BName) :
                         removeFilter | builderF.Eq("BName", businessList[i].BName);
                }

                DeleteResult deleteResult = null;
                UpdateResult updateResult = null;
                if (deleteFilter != null)
                    // businesses to delete
                    deleteResult = await _business.DeleteManyAsync(deleteFilter);
                if (removeFilter != null)
                {
                    update = Builders<Business>.Update.Pull("BOwner", owner);
                    updateResult = await _business.UpdateManyAsync(removeFilter, update);
                }
                bool deleted = deleteResult != null ? deleteResult.IsAcknowledged : true,
                removed = updateResult != null ? updateResult.IsAcknowledged : true;

                return deleted && removed;
            }
            // no businesses owned
            return true;
        }

        ///////////////////////////////////////////////////
        // delete specific client from business clients list
        ////////////////////////////////////////////////////
        public async Task<bool> deleteClientFromBusinesses(string userToDelete)
        {
            FilterDefinition<Business> filter = Builders<Business>.Filter.
            AnyEq("BClient", userToDelete) | Builders<Business>.Filter.AnyEq("BBlockedList", userToDelete);
            UpdateDefinition<Business> update = Builders<Business>.Update.
            Pull("BClient", userToDelete).Pull("BBlockedList", userToDelete);

            UpdateResult updateResult = await _business.UpdateManyAsync(filter, update);
            bool client = updateResult.MatchedCount == updateResult.ModifiedCount && updateResult.IsAcknowledged;
            return client;
        }


        ////////////////////////////////////////
        // delete messages of user or business
        ///////////////////////////////////////
        public async Task<bool> deleteMessages(string userToDelete)
        {

            FilterDefinition<Message> deleteFilter = Builders<Message>.Filter.
            Eq("RecieverId", userToDelete) | Builders<Message>.Filter.Eq("SenderId", userToDelete);
            DeleteResult deleteResult = await _messages.DeleteManyAsync(deleteFilter);
            return deleteResult.IsAcknowledged;

        }

        /////////////////////////////////////////////
        /// updating user from db
        ///////////////////////////////////
        public async Task<bool> updateUserFromDB(User user)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Email", user.Email);
            UpdateDefinition<User> update = null;
            bool flag = false;
            foreach (var field in user.GetType().GetProperties())
            {
                if (field.GetValue(user) != null && !field.GetValue(user).
                    Equals("") && !field.Name.Equals("Type"))
                {
                    if (flag == false)
                    {
                        update = Builders<User>.Update.Set(field.Name, field.GetValue(user));
                        flag = true;
                    }
                    else
                        update = update.Set(field.Name, field.GetValue(user));
                }
            }

            UpdateResult result = await _users.UpdateOneAsync(filter, update);
            if (result.MatchedCount != result.ModifiedCount)
                return false;
            return true;
        }


        //////////////////////////
        // add type (role) to user
        ///////////////////////////

        public async Task<User> addType(string email, string type)
        {
            // find user (by email)
            var builderf = Builders<User>.Filter;
            FilterDefinition<User> filter = builderf.Eq("Email", email);
            User user = await _users.Find(filter).FirstOrDefaultAsync();

            if (user != null)
            {
                if(!user.Type.Contains(type)) {
                UpdateDefinition<User> update = Builders<User>.Update.Push("Type", type);
                UpdateResult updateResult = await _users.UpdateOneAsync(filter, update);
                if (updateResult.MatchedCount != updateResult.ModifiedCount)
                    // updating failed
                    return null;
                }
                return user;
            }
            return null;
        }


        /////////////////////////////////
        // update last log in of user date
        /////////////////////////////////
        public async Task<bool> updatedLastSeen(string userEmail, long dateTime)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Email", userEmail);
            UpdateDefinition<User> update = Builders<User>.Update.Set("LastSeen", dateTime);

            UpdateResult uResulte = await _users.UpdateOneAsync(filter, update);
            if (uResulte.MatchedCount == uResulte.ModifiedCount)
                return true;
            return false;

        }

    }
}