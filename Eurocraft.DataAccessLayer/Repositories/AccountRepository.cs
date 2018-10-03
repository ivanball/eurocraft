using System;
using System.Collections.Generic;
using System.Linq;
using Eurocraft.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Eurocraft.DataAccessLayer.Services
{
    public class AccountRepository : IAccountRepository
    {
        private AuditableContext _ctx;
        private ILogger<AccountRepository> _logger;

        public AccountRepository(AuditableContext ctx, ILogger<AccountRepository> logger)
        {
            _ctx = ctx;
            _logger = logger;
        }

        public bool UserExists(string userId)
        {
            try
            {
                return _ctx.UserProfiles.Any(c => c.UserId == userId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UserExists: {ex}");
                return false;
            }
        }

        public bool UserExists(UserProfile userProfile)
        {
            try
            {
                return _ctx.UserProfiles.Any(c => c.Email == userProfile.Email && c.UserId != userProfile.UserId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in UserExists: {ex}");
                return false;
            }
        }

        public IEnumerable<UserProfile> GetAllUsers()
        {
            try
            {
                var admins = _ctx.UserPermissions.Where(up => up.UserPermissionValue == "Admin").Select(up => up.UserProfileId).ToList();
                IEnumerable<UserProfile> users = _ctx.UserProfiles.Where(u => !admins.Contains(u.UserProfileId)).ToList();
                //IEnumerable<UserProfile> users = _ctx.UserProfiles.OrderBy(c => c.Email).ToList();

                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetAllUsers: {ex}");
                return null;
            }
        }

        public UserProfile GetUserProfile(string userId)
        {
            try
            {
                UserProfile userProfile = null;
                userProfile = _ctx.UserProfiles
//                    .Include("UserPermissions")
                    .Where(c => c.UserId == userId).FirstOrDefault();

                return userProfile;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in GetUserProfile: {ex}");
                return null;
            }
        }

    }
}
