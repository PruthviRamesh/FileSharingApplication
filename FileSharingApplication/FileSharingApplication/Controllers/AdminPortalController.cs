using FileSharingApplication.Models;
using FileSharingApplication.Models.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminPortalController : ControllerBase
    {
        private readonly FileSharingDbContext db;

        public AdminPortalController(FileSharingDbContext db)
        {
            this.db = db;
        }
        [HttpPost("login")]
        public IActionResult Login(LoginDetails admin)
        {
            try
            {
                var existingUser = db.Admins.FirstOrDefault(u => u.Email ==admin.Email && u.Password == admin.Password);
                if (existingUser == null)
                {
                    return NotFound();
                }
                return Ok(existingUser);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpDelete("user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            using var transaction = await db.Database.BeginTransactionAsync();
            try
            {
                var user = await db.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                var filesToDelete = await db.Files.Where(f => f.UploadedBy == id).ToListAsync();
                foreach (var file in filesToDelete)
                {
                    var fileShares = await db.FileShares.Where(fs => fs.FileId == file.Id).ToListAsync();
                    db.FileShares.RemoveRange(fileShares);
                    var recycleBinEntries = await db.RecycleBins.Where(rb => rb.FileId == file.Id).ToListAsync();
                    db.RecycleBins.RemoveRange(recycleBinEntries);
                    db.Files.Remove(file);
                }
                var userUploadStats = await db.UserUploadStats.Where(uus => uus.UserId == id).ToListAsync();
                db.UserUploadStats.RemoveRange(userUploadStats);
                await db.SaveChangesAsync();
                db.Users.Remove(user);
                await db.SaveChangesAsync();
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    errorMessage = "An error occurred while saving the entity changes. See the inner exception for details.",
                    innerExceptionMessage = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        [HttpGet("{department}")]
        public IActionResult GetFilesByDepartment(string department)
        { 
                var usersInDepartment =db.Users
                    .Where(u => u.Department == department)
                    .Select(u => u.UserId) 
                    .ToList();

                if (usersInDepartment == null || !usersInDepartment.Any())
                {
                    return NotFound($"No users found in department: {department}");
                }
                var filesUploadedByDepartmentUsers = db.Files
                    .Where(f => usersInDepartment.Contains(f.UploadedBy))
                    .ToList();

                if (filesUploadedByDepartmentUsers == null || !filesUploadedByDepartmentUsers.Any())
                {
                    return NotFound();
                }

                return Ok(filesUploadedByDepartmentUsers);
            
        }
        [HttpGet("username/{username}")]
        public IActionResult GetFilesByUsername(string username)
        {
                var FilesByusername = db.Users.Where(u => u.Username == username).Select(u => u.UserId).ToList();
                if (FilesByusername == null)
                {
                    return NotFound();
                }
                var u = db.Files.Where(u => FilesByusername.Contains(u.UploadedBy)).ToList();
                if (u == null || !u.Any())
                {
                    return NotFound();
                }

                return Ok(u);
        }
        [HttpGet("date/{date}")]
        public IActionResult GetFilesByDate(DateTime date)
        {
                var filesUploadedOnDate = db.Files
                    .Where(f => f.UploadedAt.Date == date.Date) 
                    .ToList();

                if (filesUploadedOnDate == null || !filesUploadedOnDate.Any())
                {
                    return NotFound();
                }
                return Ok(filesUploadedOnDate);
        }
        [HttpGet("total-uploaded-files-by-day")]
        public IActionResult GetTotalUploadedFilesByDay()
        {
                var uploadedFilesByDay = db.Files
                    .GroupBy(f => f.UploadedAt.Date)
                    .Select(g => new { Date = g.Key, TotalFiles = g.Count() })
                    .ToList();

                if (uploadedFilesByDay == null || !uploadedFilesByDay.Any())
                {
                    return NotFound("No uploaded files found.");
                }

                return Ok(uploadedFilesByDay);
        }

        [HttpGet("total-shared-files-by-day")]
        public IActionResult GetTotalSharedFilesByDay()
        {
                var sharedFilesByDay = db.FileShares
                    .GroupBy(fs => fs.SharedAt.Date)
                    .Select(g => new { Date = g.Key, TotalShares = g.Count() })
                    .ToList();

                if (sharedFilesByDay == null || !sharedFilesByDay.Any())
                {
                    return NotFound("No shared files found.");
                }

                return Ok(sharedFilesByDay);
            }
    }
}
