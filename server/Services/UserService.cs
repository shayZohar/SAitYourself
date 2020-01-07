// by shay and amit
using System;
using System.Collections.Generic;
using System.Linq;
using server.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System.Threading.Tasks;
using MongoDB.Bson;

namespace server.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        /////////////////////////////////////
        //getting collection of users
        /////////////////////////////////////
        public UserService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _users = database.GetCollection<User>("user");
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
        /////////////////////////////////////////////////////////////////////////
        // get user by its email,used to check if user already exists in database
        /////////////////////////////////////////////////////////////////////////
        public async Task<User> TryGetUser(string email)
        {
            var filter = new BsonDocument("Email", email);
            User user = await _users.Find<User>(filter).FirstOrDefaultAsync();
            return user;
        }

        //////////////////////////////////////////////////
        //veryfing user in log in by email and password
        //////////////////////////////////////////////////
        public async Task<User> GetAuthUser(string email, string pWord)
        {
            User user = await _users.Find<User>(u => u.Email == email).FirstOrDefaultAsync();
            if (user == null)
                return null;
            ///////////////////////////////////////////
            // checking if the password is correct
            ///////////////////////////////////////////
            if (!VerifyPasswordHash(pWord, user.PWordHash, user.PWordSalt))
                return null;
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

        public async Task<string[]> getRoles(string email)
        {
            var builderf = Builders<User>.Filter;
            var filter = builderf.Eq("Email", email);
            //var projection = Builders<User>.Projection;
            // helpME AMIT projection: how to get a spcific field from databas using FindAsync
            var choice = Builders<User>.Projection.Include("Type").Exclude("_id");
            var result = await _users.Find<User>(filter).Project<User>(choice).FirstOrDefaultAsync();   
            return result.Type;
        }

        // public async Task<List<User>> getUsersList(string[] emailArray){
        //     var builderf = Builders<User>.Filter;
        //     var filter  = builderf.

        //     return result;
        // }
    }
}