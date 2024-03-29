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
    public class FileService
    {
        private readonly IMongoCollection<ImageFile> _files;
        public FileService(IConfiguration config)
        {
            var client = new MongoClient("mongodb://localhost:27017");
            var database = client.GetDatabase("sait-yourself");
            _files = database.GetCollection<ImageFile>("ImageFiles");
        }
        ///////////////////////////////////////////////
        //inserting new file to collection in database
        ///////////////////////////////////////////////
        public async Task<List<ImageFile>> Create(List<ImageFile> files)
        {
            await _files.InsertManyAsync(files);
            return files;
        }

        //////////////////////////////////////////////
        // getting files path from db by business name
        //////////////////////////////////////////////
        public async Task<List<ImageFile>> GetFiles(string bName)
        {
            List<ImageFile> files = await _files.Find<ImageFile>(m => m.FileOwner == bName).ToListAsync();
            return files;
        }

        ////////////////////////////////////////////////
        // deleting file path from db
        ////////////////////////////////////////////
        public async Task<Boolean> DeleteFile(ImageFile file)
        {
            DeleteResult result = await _files.DeleteOneAsync(m => m.Id == file.Id);
            return result.IsAcknowledged;
        }

    }
}