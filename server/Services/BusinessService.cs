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

        /////////////////////////////////////
        // getting collection of businesses
        /////////////////////////////////////
        public BusinessService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _businesses = database.GetCollection<Business>("Businesses");

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
        //get business by its email
        ///////////////////////////////////////////////
        public async Task<Business> TryGetBusiness(string email)
        {
            var filter = new BsonDocument("bMail", email);
            Business business = await _businesses.Find<Business>(filter).FirstOrDefaultAsync();
            return business;
        }

        //////////////////////////////////////////////////
        // getting a list of all businesses in collection
        // or getting a list of owner collection depending on the email
        //////////////////////////////////////////////////
        public async Task<List<Business>> GetAllBusinesses(string email)
        {
            List<Business> businesses;
            // need all of the businesess
            if (email == null)
                businesses = await _businesses.Find<Business>(_ => true).ToListAsync();
            else
            {
                //////////////////////////////////////////////////
                // AMIT
                // if looking for specific business owner, will be changed when bOwners will be set properly
                /////////////////////////////////////////////////
                var builder = Builders<Business>.Filter;
                var filter = builder.Eq("BMail", email);
                businesses = await _businesses.Find<Business>(filter).ToListAsync();
            }
            return businesses;
        }

        // AMIT
        // public async Task<Boolean> updateHomeVal(bHome home, string bToChange){
        public async Task<Boolean> updateHomeVal(BHome bHome, string bToChange)
        {
            int flag = 0;
            // the filter
            var builderF = Builders<Business>.Filter;
            var filter = builderF.Eq("BMail", bToChange);

            // the business to update
            var builderU = Builders<Business>.Update;

            // AMIT

            UpdateDefinition<Business> update = null;

            foreach (var field in bHome.GetType().GetProperties())
            {
                    if (!field.GetValue(bHome).Equals(""))
                        if (flag == 0)
                        {
                            update = builderU.Set("BHome."+field.Name, field.GetValue(bHome));
                            flag = 1;
                        }
                        else
                           update = update.Set("BHome."+field.Name, field.GetValue(bHome));
            }

            // the query
            var result = await _businesses.UpdateOneAsync(filter, update);
            if (result == null)
                return false;
            return true;
        }

 public async Task<Boolean> updateAboutVal(BAbout bAbout, string bToChange)
        {
            int flag = 0;
            // the filter
            var builderF = Builders<Business>.Filter;
            var filter = builderF.Eq("BMail", bToChange);

            // the business to update
            var builderU = Builders<Business>.Update;

            // AMIT

            UpdateDefinition<Business> update = null;

            foreach (var field in bAbout.GetType().GetProperties())
            {
                    if (!field.GetValue(bAbout).Equals(""))
                        if (flag == 0)
                        {
                            update = builderU.Set("BAbout."+field.Name, field.GetValue(bAbout));
                            flag = 1;
                        }
                        else
                           update = update.Set("BAbout."+field.Name, field.GetValue(bAbout));
            }

            // the query
            var result = await _businesses.UpdateOneAsync(filter, update);
            if (result == null)
                return false;
            return true;
        }
        ///////////////////////////////////////
        // AMIT remember: need to combine both of GetOwnerBusiness & GetUserBusinesses
        ///////////////////////////////////////
        public async Task<List<Business>> GetOwnerBusiness(string email){
            var builderF = Builders<Business>.Filter;
            var filter = builderF.AnyEq("BOwner",email);
            var choice = Builders<Business>.Projection.Exclude("_id");

            List<Business> businesses = await _businesses.Find<Business>(filter).Project<Business>(choice).ToListAsync();
            return businesses;
        }

        public async Task<List<Business>> GetUserBusinesses(string email){
            var builderF = Builders<Business>.Filter;
            var filter = builderF.AnyEq("BClient",email);
            List<Business> businesses = await _businesses.Find<Business>(filter).ToListAsync();
            return businesses;
        }
    }
}