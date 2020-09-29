// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;

using server.Utilities;
using server.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System.Threading.Tasks;
using MongoDB.Bson;
using System.Reflection;

namespace server.Services
{
    public class BusinessService
    {
        private readonly IMongoCollection<Business> _businesses;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Appointment> _appointment;
        private readonly IMongoCollection<Message> _messages;
        /////////////////////////////////////
        // getting collection of businesses
        /////////////////////////////////////
        public BusinessService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _businesses = database.GetCollection<Business>("Businesses");
            _appointment = database.GetCollection<Appointment>("Appointments");
            _users = database.GetCollection<User>("user");
            _messages = database.GetCollection<Message>("Messages");

        }
        ////////////////////////////////////////
        // inserting new business to collection
        ////////////////////////////////////////
        public async Task<Business> Create(Business business)
        {
            await _businesses.InsertOneAsync(business);
            return business;
        }
        ///////////////////////////////////////////////
        //get business by its name
        ///////////////////////////////////////////////
        public async Task<Business> TryGetBusiness(string name)
        {
            var filter = Builders<Business>.Filter.Eq("BName", name);
            Business business = await _businesses.Find<Business>(filter).FirstOrDefaultAsync();
            return business;
        }

        //////////////////////////////////////////////////
        // getting a list of all businesses in collection
        // or getting a list of owner collection depending on the email
        //////////////////////////////////////////////////
        public async Task<List<Business>> GetAllBusinesses(string email, string type)
        {
            List<Business> businesses;
            // need all of the businesess
            if (email == null)
            {
                businesses = await _businesses.Find<Business>(_ => true).ToListAsync();
                foreach (var business in businesses)
                {
                    if (business.OwnerConnected == true)
                        business.OwnerConnected = false;
                }
            }
            else if (type.Equals("Client"))
            {
                FilterDefinition<Business> filter = Builders<Business>.Filter.AnyNe("BBlockedList", email);
                businesses = await _businesses.Find(filter).ToListAsync();
            }
            else
            {
                //////////////////////////////////////////////////
                // if looking for specific business owner, will be changed when bOwners will be set properly
                /////////////////////////////////////////////////
                FilterDefinition<Business> filter = Builders<Business>.Filter.AnyEq("BOwner", email);
                businesses = await _businesses.Find<Business>(filter).ToListAsync();
            }
            return businesses;
        }

        ////////////////////////////////
        // updating home page content
        ////////////////////////////////
        public async Task<Boolean> updateHomeVal(BHome bHome, string bToChange)
        {
            if (bHome != null)
            {
                // int flag = 0;
                // the filter
                var builderF = Builders<Business>.Filter;
                var filter = builderF.Eq("BName", bToChange);
                // the business to update
                var builderU = Builders<Business>.Update;
                UpdateDefinition<Business> update = builderU.Set("BHome", bHome);

                // the query
                UpdateResult result = await _businesses.UpdateOneAsync(filter, update);
                if (result.MatchedCount == result.ModifiedCount)
                    return true;
            }
            return false;
        }

        ////////////////////////////////
        // update about page content
        ///////////////////////////////

        public async Task<Boolean> updateAboutVal(BAbout bAbout, string bToChange)
        {
            // the filter
            var builderF = Builders<Business>.Filter;
            var filter = builderF.Eq("BName", bToChange);

            // the business to update
            var builderU = Builders<Business>.Update;
            UpdateDefinition<Business> update = builderU.Set("BAbout", bAbout);
            // the query
            UpdateResult result = await _businesses.UpdateOneAsync(filter, update);
            if (result.MatchedCount == result.ModifiedCount)
                return true;
            return false;
        }
        ///////////////////////////////////////
        // get businesses bu owner
        ///////////////////////////////////////
        public async Task<List<Business>> GetOwnerBusiness(string email)
        {
            var builderF = Builders<Business>.Filter;
            var filter = builderF.AnyEq("BOwner", email);
            var choice = Builders<Business>.Projection.Exclude("_id");

            List<Business> businesses = await _businesses.Find<Business>(filter).Project<Business>(choice).ToListAsync();
            return businesses;
        }

        ///////////////////////////////////
        // get businesses a client is registered to
        /////////////////////////////////////

        public async Task<List<Business>> GetUserBusinesses(string email)
        {
            var builderF = Builders<Business>.Filter;
            var filter = builderF.AnyEq("BClient", email);
            List<Business> businesses = await _businesses.Find<Business>(filter).ToListAsync();
            return businesses;
        }

        /////////////////////////////////////
        // check if business's email exists
        ///////////////////////////////////
        public async Task<bool> emailExists(string businessEmail)
        {
            Business business = await _businesses.Find<Business>(b => b.BMail == businessEmail).FirstOrDefaultAsync();
            User user = await _users.Find<User>(u => u.Email == businessEmail).FirstOrDefaultAsync();

            return business != null || user != null;
        }

        ///////////////////////////////////////////
        // get list of users by specific request
        ///////////////////////////////////////////
        public async Task<List<User>> getUserstList(string businessName, string mongoField)
        {
            FilterDefinition<Business> Businessfilter = Builders<Business>.Filter.Eq("BName", businessName);
            var choice = Builders<Business>.Projection.Exclude("_id").Include(mongoField);
            var listFromBusiness = await _businesses.Find(Businessfilter).Project<Business>(choice).FirstOrDefaultAsync();
            if (listFromBusiness == null)
                return null;
            string[] usersEmail;
            if (mongoField.Equals("BOwner"))
            {
                usersEmail = listFromBusiness.BOwner;
            }
            else if (mongoField.Equals("BClient"))
                usersEmail = listFromBusiness.BClient;
            else
                // getting BBlocked list
                usersEmail = listFromBusiness.BBlockedList;

            var builderF = Builders<User>.Filter;
            FilterDefinition<User> usersFilter = builderF.Empty;
            foreach (var item in usersEmail)
            {
                if (usersFilter == FilterDefinition<User>.Empty)
                    usersFilter = builderF.Eq("Email", item);
                else
                    usersFilter = usersFilter | builderF.Eq("Email", item);
            }
            if (usersFilter == builderF.Empty)
                return new List<User>();
            List<User> usersList = await _users.Find<User>(usersFilter).ToListAsync();
            return usersList;
        }


        //////////////////////////////////
        // adding user to specific business
        //////////////////////////////////
        public async Task<User> addUserToBusiness(string businessName, string newUser, string type)
        {
            var builderF = Builders<User>.Filter;
            FilterDefinition<User> filter = builderF.Eq("Email", newUser);
            var choice = Builders<User>.Projection.Exclude("_id");
            User result = await _users.Find<User>(filter).Project<User>(choice).FirstOrDefaultAsync();
            if (result != null)
            {
                string mongoField = type.Equals("Client") ? "BClient" : "BOwner";
                bool hasType = result.Type.Contains(type);
                if (!hasType)
                {
                    UpdateDefinition<User> updateType = Builders<User>.Update.Push("Type", type);
                    var addType = await _users.UpdateOneAsync(filter, updateType);
                }
                var businessBuilderU = Builders<Business>.Update;
                UpdateDefinition<Business> update = businessBuilderU.Push(mongoField, newUser);
                UpdateResult userAdded;
                if (type.Equals("Client"))
                {
                    Business business = await this.TryGetBusiness(businessName);
                    if (business.BClient.GetLength(0) <= 0 || business.BClient[0] == null || business.BClient[0].Equals(""))
                    {
                        string[] clientArray = new string[] { newUser };
                        update = businessBuilderU.Set(mongoField, clientArray);
                    }
                    userAdded = await _businesses.UpdateOneAsync(b => b.BName == businessName & !b.BClient.Contains(newUser), update);
                }
                else
                    userAdded = await _businesses.UpdateOneAsync(b => b.BName == businessName & !b.BOwner.Contains(newUser), update);

            }
            return result;
        }


        /////////////////////////////////////////
        // remove client from business
        /////////////////////////////////////////
        public async Task<Boolean> removeFromBusiness(string businessName, string client, bool block)
        {
            var builderF = Builders<Business>.Filter;
            FilterDefinition<Business> filter = builderF.Eq("BName", businessName);

            var builderU = Builders<Business>.Update;
            UpdateDefinition<Business> update = builderU.Pull("BClient", client);
            // refers to blocked list
            if (block)
            {
                var tempResult = await _businesses.Find(filter).FirstOrDefaultAsync();
                if (tempResult.BBlockedList.Length <= 0 || tempResult.BBlockedList[0] == null)
                {
                    string[] blocked = new string[] { client };
                    update = update.Set("BBlockedList", blocked);
                }
                else
                    update = update.Push("BBlockedList", client);
            }
            var result = await _businesses.UpdateOneAsync(filter, update);
            return result != null ? true : false;
        }

        //////////////////////////////////
        // unblock user from business
        /////////////////////////////////
        public async Task<bool> unBlockFromBusiness(string businessName, string user)
        {
            var filter = Builders<Business>.Filter.Eq("BName", businessName);
            var builderU = Builders<Business>.Update;
            UpdateDefinition<Business> update = builderU.Pull("BBlockedList", user);
            UpdateResult result = await _businesses.UpdateOneAsync(filter, update);
            if (result.MatchedCount != result.ModifiedCount)
                return false;
            return true;
        }

        //////////////////////////////////////////
        // remove owner from business owners list
        ///////////////////////////////////////
        // helpME amitNew
        public async Task<bool> removeOwnerFromBusiness(string businessName, string owner)
        {
            var builderF = Builders<Business>.Filter;
            FilterDefinition<Business> filter = builderF.Eq("BName", businessName);
            UpdateDefinition<Business> update = Builders<Business>.Update.Pull("BOwner", owner);

            UpdateResult result = await _businesses.UpdateOneAsync(filter & builderF.SizeGt("BOwner", 1), update);
            if (result.ModifiedCount != result.ModifiedCount || result.MatchedCount == 0)
            { // if on or less owners befor pulling
                bool deleteResult = await deletedByAdmin(businessName);
                return deleteResult;
            }
            return true;
        }


        ///////////////////////////////////////////////
        //// delete business by admin
        ///////////////////////////////////////////
        public async Task<bool> deletedByAdmin(string businessName)
        {
            var builderF = Builders<Business>.Filter;
            FilterDefinition<Business> filter = builderF.Eq("BName", businessName);
            Business business = await _businesses.Find(filter).FirstOrDefaultAsync();
            bool deleteUser = await this.deleteAllBusinessUsers(business);
            DeleteResult deleteAppResult = await _appointment.DeleteOneAsync(app => app.BName.Equals(businessName));
            DeleteResult deleteBusinessResult = null;
            if (deleteUser && deleteAppResult.IsAcknowledged)
            {
                deleteBusinessResult = await _businesses.DeleteOneAsync(filter);
                return deleteBusinessResult.IsAcknowledged;
            }
            return false;
        }


        //////////////////////////////////
        // delete messages of business
        /////////////////////////////////
        public async Task<bool> deleteMessages(string businessMail)
        {
            if (businessMail != null)
            {
                var builderF = Builders<Message>.Filter;
                FilterDefinition<Message> deleteFilter = builderF.Eq("RecieverId", businessMail) | builderF.Eq("SenderId", businessMail);
                DeleteResult deleteResult = await _messages.DeleteManyAsync(deleteFilter);
                return deleteResult.IsAcknowledged;
            }
            return false;
        }

        ////////////////////////////////////
        // delete users from business
        ///////////////////////////////////
        public async Task<bool> deleteAllBusinessUsers(Business business)
        {
            //true; // check owners => delete if needed
            bool owners = await this.checkOwner(business.BOwner, business.BName);
            // check clients => delete if needed
            bool clients = await this.checkClients(business.BClient, business.BName);

            return owners && clients;
        }


        //////////////////////////////////////////////////////////////////////////////////////////
        // checking status of owner in the system and deleting it if possible to avoid errors
        ///////////////////////////////////////////////////////////////////////////////////////////
        public async Task<bool> checkOwner(string[] owners, string businessName)
        {
            var usersBuilderF = Builders<User>.Filter;
            var businessBuilderF = Builders<Business>.Filter;
            FilterDefinition<Business> businessFilter = null;

            FilterDefinition<User> noOtherBusinessesOwnersList = null;

            FilterDefinition<User> sendDeleteMessage = null;
            foreach (string owner in owners)
            {
                businessFilter = businessBuilderF.AnyEq("BOwner", owner) & businessBuilderF.Ne("BName", businessName);
                Business business = await _businesses.Find(businessFilter).FirstOrDefaultAsync();
                if (business == null)
                {
                    //  owners query list to remove type
                    noOtherBusinessesOwnersList = noOtherBusinessesOwnersList == null ? usersBuilderF.Eq("Email", owner) :
                     noOtherBusinessesOwnersList |
                      usersBuilderF.Eq("Email", owner);
                }
                // add to send message query
                sendDeleteMessage = sendDeleteMessage == null ? usersBuilderF.Eq("Email", owner) :
                sendDeleteMessage | usersBuilderF.Eq("Email", owner);
            }
            bool rmoveTypeResulte = await deleteRoll(noOtherBusinessesOwnersList, "Business Owner");
            DeleteResult deleteResult = null;
            if (rmoveTypeResulte && noOtherBusinessesOwnersList != null)
                deleteResult = await _users.DeleteManyAsync((noOtherBusinessesOwnersList) & Builders<User>.Filter.Size("Type", 0));
            if (sendDeleteMessage != null)
                sendAMessage(sendDeleteMessage, "admin@gmail.com", businessName);
            return deleteResult != null ? deleteResult.IsAcknowledged && rmoveTypeResulte : true;
        }

        //////////////////////////////////////////////////////////////////////////////////////////
        // checking status of clients in the system and deleting it if possible to avoid errors
        ///////////////////////////////////////////////////////////////////////////////////////////
        public async Task<bool> checkClients(string[] clients, string businessName)
        {
            var usersBuilderF = Builders<User>.Filter;
            var businessBuilderF = Builders<Business>.Filter;
            FilterDefinition<Business> businessFilter = null;

            FilterDefinition<User> noOtherBusinessesClientsList = null;
            FilterDefinition<User> sendDeleteMessage = null;
            foreach (string client in clients)
            {
                businessFilter = businessBuilderF.AnyEq("BClient", client) & businessBuilderF.Ne("BName", businessName);
                Business business = await _businesses.Find(businessFilter).FirstOrDefaultAsync();
                if (business == null)
                {
                    //  owners query list to remove type
                    noOtherBusinessesClientsList = noOtherBusinessesClientsList == null ? usersBuilderF.Eq("Email", client) :
                     noOtherBusinessesClientsList |
                      usersBuilderF.Eq("Email", client);
                }
                // add to send message query
                sendDeleteMessage = sendDeleteMessage == null ? usersBuilderF.Eq("Email", client) :
                sendDeleteMessage | usersBuilderF.Eq("Email", client);
            }
            bool rmoveTypeResulte = await this.deleteRoll(noOtherBusinessesClientsList, "Client");
            DeleteResult deleteResult = null;
            if (rmoveTypeResulte && noOtherBusinessesClientsList != null)
                deleteResult = await _users.DeleteManyAsync(noOtherBusinessesClientsList & Builders<User>.Filter.Size("Type", 0));
            if (sendDeleteMessage != null)
                sendAMessage(sendDeleteMessage, "admin@gmail.com", businessName);
            return deleteResult != null ? deleteResult.IsAcknowledged && rmoveTypeResulte : true;
        }

        /////////////////////////////////////////
        // deleting user role from user type list
        //////////////////////////////////////////
        public async Task<bool> deleteRoll(FilterDefinition<User> filter, string typeToDelete)
        {
            if (filter != null)
            {
                // need to delete type
                UpdateDefinition<User> update = Builders<User>.Update.Pull("Type", typeToDelete);
                UpdateResult result = await _users.UpdateManyAsync(filter, update);
                if (result.MatchedCount == result.ModifiedCount && result.IsAcknowledged)
                    return true;
                return false;
            }
            else
                // dose not need to delete type
                return true;
        }

        public async void sendAMessage(FilterDefinition<User> filter, string senderEmail, string businessName)
        {
            List<User> usersList = await _users.Find<User>(filter).ToListAsync();

            if (usersList != null)
            {
                foreach (User user in usersList)
                {
                    Message message = new Message();
                    message.RecieverId = user.Email;
                    message.SenderId = senderEmail;
                    message.SubJect = businessName + " was Removed";
                    message.MessContent = "Hello " + user.FName + " " + user.LName + ".\n I am sorry to inform that " + businessName + " wase removed From SAit Yourself system";
                    await _messages.InsertOneAsync(message);
                }
            }
        }
        ////////////////////////////////////////
        // inserting new appointments to collection
        ////////////////////////////////////////
        public async Task<Appointment> setAppointment(Appointment app)
        {
            var filter_id = Builders<Appointment>.Filter.Eq("BName", app.BName);
            var result = await _appointment.FindOneAndDeleteAsync(filter_id);
            await _appointment.InsertOneAsync(app);
            return app;
        }

        /////////////////////////////////
        // update appoinemt
        //////////////////////////////
        public async Task<Appointment> updateAppointment(Appointment app)
        {
            FilterDefinition<Appointment> filter_id = Builders<Appointment>.Filter.Eq("BName", app.BName);
            Appointment appointment = await _appointment.FindOneAndReplaceAsync(filter_id, app);
            return appointment;
        }

        ///////////////////////////////////////////////
        //get appointments by its bname
        ///////////////////////////////////////////////
        public async Task<Appointment> GetAppointment(string name)
        {
            var filter = new BsonDocument("BName", name);
            Appointment app = await _appointment.Find<Appointment>(filter).FirstOrDefaultAsync();
            return app;
        }

        ////////////////////////////////////////////////////
        // update business appointment page existance setting 
        /////////////////////////////////////////////////////
        public async Task<bool> updateApp(bool value, string businessName)
        {
            var oldAppointment = GetAppointment(businessName);
            if (value == true && oldAppointment == null)
            {
                // creating new appointment
                Appointment app = new Appointment();
                app.BName = businessName;
                await this.setAppointment(app);
                // app.BName = businessName;
            }
            FilterDefinition<Business> filter = Builders<Business>.Filter.Eq("BName", businessName);
            UpdateDefinition<Business> update = Builders<Business>.Update.Set("BAppointment", value);
            UpdateResult result = await _businesses.UpdateOneAsync(filter, update);
            if (result.MatchedCount == result.ModifiedCount)
                return true;
            return false;

        }

        ////////////////////////////////////////////////////
        // update business gallery page existance setting 
        /////////////////////////////////////////////////////
        public async Task<bool> updateGallery(bool value, string businessName)
        {
            FilterDefinition<Business> filter = Builders<Business>.Filter.Eq("BName", businessName);
            UpdateDefinition<Business> update = Builders<Business>.Update.Set("BGallery", value);
            UpdateResult result = await _businesses.UpdateOneAsync(filter, update);
            if (result.MatchedCount == result.ModifiedCount)
                return true;
            return false;
        }

        ///////////////////////////////////////////////////////////////////
        // set business setting as owner is connected to block other editing
        //////////////////////////////////////////////////////////////////
        public async Task<bool> connectOwner(string businessName)
        {

            UpdateDefinition<Business> update = Builders<Business>.Update.Set("OwnerConnected", true);
            UpdateResult updateResulte = await _businesses.UpdateOneAsync(b => b.BName.Equals(businessName)
                                        & b.OwnerConnected == false, update);
            return updateResulte.MatchedCount > 0 && updateResulte.ModifiedCount == updateResulte.MatchedCount;
        }


        //////////////////////////////////////////////////////////////////////
        // set business setting as owner is disconnected to allow other editing
        ///////////////////////////////////////////////////////////////////////
        public async Task<bool> disconnectOwner(string businessName)
        {
            UpdateDefinition<Business> update = Builders<Business>.Update.Set("OwnerConnected", false);
            UpdateResult updateResulte = await _businesses.UpdateOneAsync(b => b.BName.Equals(businessName), update);
            return updateResulte.MatchedCount > 0 && updateResulte.ModifiedCount == updateResulte.MatchedCount;
        }


    }
}