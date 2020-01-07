namespace server.Utilities
{
    ////////////////////////////////////////////////
    // a class to be able to changespecific parts
    ////////////////////////////////////////////////
    public class BHome
    {
        // AMIT - change class name later
        private string headerText;
        private string subHeaderText;
        private string articalText;


        public BHome(string header = "", string subHeader = "", string artical = "")
        {
            headerText = header;
            subHeaderText = subHeader;
            articalText = artical;
        }

        public string HeaderText { get; set; }

        public string SubHeaderText { get; set; }
        public string ArticalText { get; set; }

        public override string ToString()
        {
            return "\nHeader: "+headerText+"\nSub Header: "+subHeaderText+"\nArtical: "+articalText+"\n";
        }

    }
}