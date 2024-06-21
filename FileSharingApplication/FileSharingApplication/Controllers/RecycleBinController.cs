using FileSharingApplication.Models;
using FileSharingApplication.Models.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecycleBinController : ControllerBase
    {
        private readonly FileSharingDbContext _context;

        public RecycleBinController(FileSharingDbContext context)
        {
            _context = context;
        }

        [HttpGet("listRecycleBin/{userId}")]
        public IActionResult GetRecycleBin(int userId)
        {
              var recycleBinFiles = _context.RecycleBins
                    .Include(rb => rb.File) 
                    .Where(rb => rb.File.UploadedBy == userId) 
                    .ToList();

                return Ok(recycleBinFiles);
        }

        [HttpPost("restoreFromRecycleBin/{fileId}")]
        public IActionResult RestoreFileFromRecycleBin(int fileId, RestoreOptions option)
        {
                var recycleBinEntry = _context.RecycleBins.FirstOrDefault(r => r.FileId == fileId);
                if (recycleBinEntry == null)
                {
                    return NotFound(new { message = "File not found in recycle bin." });
                }

                var fileToRestore = _context.Files.Find(fileId);
                if (fileToRestore == null)
                {
                    return NotFound(new { message = "File not found in the database." });
                }

            if (option.RestorePermanently)
            {
                fileToRestore.IsDeleted = false;
                fileToRestore.DeletedAt = null;
                fileToRestore.RetentionDate = null;
                _context.RecycleBins.Remove(recycleBinEntry);
                _context.SaveChanges();
                return Ok();
            }
            else if (option.RetentionDate.HasValue)
            {
                fileToRestore.RetentionDate = option.RetentionDate.Value;
                fileToRestore.IsDeleted = false;
                fileToRestore.DeletedAt = null;
                _context.RecycleBins.Remove(recycleBinEntry);
                _context.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }


        [HttpDelete("deletePermanently/{fileId}")]
        public IActionResult DeleteFilePermanently(int fileId)
        {
                var fileToDelete = _context.Files.Find(fileId);
                if (fileToDelete == null)
                {
                    return NotFound(new { message = "File not found." });
                }

                var recycleBinEntry = _context.RecycleBins.FirstOrDefault(rb => rb.FileId == fileId);
                if (recycleBinEntry != null)
                {
                    _context.RecycleBins.Remove(recycleBinEntry);
                }

                _context.Files.Remove(fileToDelete);
                _context.SaveChanges();

                 return Ok(new { message = "File deleted permanently." });
            
        }
    }
}
