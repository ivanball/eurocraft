using Eurocraft.Models;
using System.Collections.Generic;

namespace Eurocraft.DataAccessLayer.Services
{
    public interface IAccountRepository
    {
        bool UserExists(string userId);
        bool UserExists(UserProfile userProfile);
        IEnumerable<UserProfile> GetAllUsers();
        UserProfile GetUserProfile(string userId);
    }
}
