namespace server.Utilities
{
    ////////////////////////////////////////////////
    // a class to be able to change specific parts
    ////////////////////////////////////////////////
    public class BAbout
    {
        private string headerText;
        private string subHeaderText;
        private string articalText;
        private string addressText;

        public BAbout(string header = "", string subHeader = "", string artical = "", string address = "")
        {
            headerText = header;
            subHeaderText = subHeader;
            articalText = artical;
            addressText = address;
        }

        public string HeaderText { get; set; }

        public string SubHeaderText { get; set; }
        public string ArticalText { get; set; }
        public string AddressText{get; set; }

        public override string ToString()
        {
            return "\nHeader: "+headerText+"\nSub Header: "+subHeaderText+
                    "\nArtical: "+articalText+"\nAddress: "+addressText;
        }

    }
}