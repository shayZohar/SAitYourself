using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using server.Utilities;
namespace server.Models
{
    //geters & setters
    public class AppList
    {
        public int Id{ get; set; }
        public string Subject{get;set;}
        public string Description{get;set;}
        public DateTime StartTime{get;set;}
        public DateTime EndTime{get;set;}
        public string Client{get;set;}

//Constructor of AppList
//this is the actual Appointment details
        public AppList(int? iden,string sub="",string des="",DateTime start = new DateTime(),
                        DateTime end = new DateTime(), string c = "") {
            if(iden.HasValue)
                Id = iden.Value;
            Subject = sub;
            Description = des;
            StartTime = start;
            EndTime = end;
            Client = c;
        } 

    }
    public class Appointment
    {
        //geters & setters
         [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id{ get; set; }
        public string BName{get;set;}
        public AppList[] AppointmentList{get;set;}
        public int Counter{get; set; }
        public int[] Days{ get; set; }
        public long Start{get;set; }
        public long End{get;set; }

//Constructor of Appointment
//this is the object that holds the whole details of the business schedular section
        public Appointment(string i="",string name="",AppList[] lists = null, int count = 0,
        int[] days = null,long s = 21600000, long e = 54000000){
            Id=i;
            BName = name;
            if(lists == null)
                lists = new AppList[1];
            AppointmentList = lists;
            Counter = count;
            if(days == null){
                days = new int[7];
                for(int var = 0; var < 7; var++)
                    days[var] = var;
            }
            Days = days;
            Start = s;
            End = e;
        }
    }
}