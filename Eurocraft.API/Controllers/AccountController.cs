using System;
using System.Linq;
using System.Security.Claims;
using Eurocraft.DataAccessLayer.Services;
using Eurocraft.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Eurocraft.API.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private IAccountRepository _accountRepository;
        private ILogger<AccountRepository> _logger;

        public AccountController(IAccountRepository accountRepository, ILogger<AccountRepository> logger)
        {
            _accountRepository = accountRepository;
            _logger = logger;
        }

        [HttpGet("Users")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            try
            {
                var allUsers = _accountRepository.GetAllUsers();
                return Ok(allUsers);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /Users: {ex}");
                return BadRequest();
            }
        }

        [HttpGet("AuthContext")]
        [Authorize()]
        public IActionResult GetAuthContext()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var profile = _accountRepository.GetUserProfile(userId);
                if (profile == null) return NotFound();
                var context = new AuthContext { UserProfile = profile, Claims = User.Claims.Select(c => new SimpleClaim { Type = c.Type, Value = c.Value }).ToList() };
                return Ok(context);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed in Get /AuthContext: {ex}");
                return BadRequest();
            }
        }
    }
}