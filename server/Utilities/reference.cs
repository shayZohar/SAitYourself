// AMIT a new class for a list will hold data name & email of type needed
namespace server.Utilities
{
    public class Reference
    {
        private string name,
                        email;
        public Reference(string newName="", string newEmail=""){
            name = newName;
            email = newEmail;
        }

        public string Name{
            get{
                return name;
            }
            set{name = value;}
        }

        public string Email{
            get{
                return email;
            }
            set{email = value;}
        }

    }
}