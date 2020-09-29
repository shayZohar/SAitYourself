namespace server.Utilities
{

    /////////////////////////////////
    // updating specific fields of setting
    ////////////////////////////////////
    public class boolUpdate
    {
        private bool valueToUpdate;
        private string keyToUpdate,
                        mongoField;

        public boolUpdate(bool value= false, string key = "", string field="") {
            this.valueToUpdate = value;
            this.keyToUpdate = key;
            this.mongoField = field;
        }


        public bool ValueToUpdate {get; set;}
        public string KeyToUpdate {get; set;}
        public string MongoField {get; set;}
        
    }
}