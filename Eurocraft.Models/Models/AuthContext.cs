using System.Collections.Generic;

namespace Eurocraft.Models
{
    public class AuthContext
    {
        public UserProfile UserProfile { get; set; }
        public List<SimpleClaim> Claims { get; set; }
    }
}
