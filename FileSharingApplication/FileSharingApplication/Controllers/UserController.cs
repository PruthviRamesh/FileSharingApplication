using FileSharingApplication.Models;
using FileSharingApplication.Models.Data;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FileSharingDbContext _context;

        public UserController(FileSharingDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult RegisterUser(UserDetails user)
        {
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);
                if (existingUser != null)
                {
                    return NotFound();
                }
                var u = new User()
                {
                    Username = user.Username,
                    Email = user.Email,
                    Password = user.Password,
                    Department = user.Department,
                };
                _context.Users.Add(u);
                _context.SaveChanges();
                return Ok();
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDetails user)
        {
                var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email && u.Password == user.Password);
                if (existingUser == null)
                {
                    return NotFound();
                }
                return Ok(existingUser);
        }
        [HttpGet("users")]
        public IActionResult getUsers()
        {
            return Ok(_context.Users);
        }
        [HttpGet("{email}")]
        public IActionResult getUserByEmail(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

    }
}
