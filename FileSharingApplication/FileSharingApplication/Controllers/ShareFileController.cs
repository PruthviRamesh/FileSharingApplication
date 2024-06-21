using FileSharingApplication.Models;
using FileSharingApplication.Models.Data;
using Microsoft.AspNetCore.Mvc;

namespace FileSharingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShareFileController : ControllerBase
    {
        private readonly FileSharingDbContext _context;
        public ShareFileController(FileSharingDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult ShareFile(FileShareDetails fileShareDetails)
        {
                var file = _context.Files.Find(fileShareDetails.FileId);
                if (file == null)
                {
                    return NotFound("File not found.");
                }

                var sharedWithUser =  _context.Users.Find(fileShareDetails.SharedWithUserId);
                if (sharedWithUser == null)
                {
                    return NotFound("Shared with user not found.");
                }

                var fileShare = new Models.FileShare
                {
                    FileId = fileShareDetails.FileId,
                    SharedWithUserId = fileShareDetails.SharedWithUserId,
                    SharedByUserId = fileShareDetails.SharedByUserId,
                    SharedAt = DateTime.UtcNow
                };

                _context.FileShares.Add(fileShare);
                _context.SaveChanges();

                return Ok(fileShare);
        }

        [HttpGet("{userid}")]
        public IActionResult GetFilesByUserId(int userid)
        {
                var sharedFiles = from fileShare in _context.FileShares
                                  join file in _context.Files on fileShare.FileId equals file.Id
                                  join user in _context.Users on fileShare.SharedByUserId equals user.UserId
                                  where fileShare.SharedWithUserId == userid
                                  select new
                                  {
                                      FileId = file.Id,
                                      Filename = file.Filename,
                                      FilePath = file.FilePath,
                                      FileSize = file.FileSize,
                                      UploadedAt = file.UploadedAt,
                                      SharedByUser = user.Username,
                                      SharedAt = fileShare.SharedAt
                                  };

                return Ok(sharedFiles);
        }

        [HttpGet]
        public IActionResult GetAllSharedFiles()
        {
                var fileShares = _context.FileShares.ToList();
                return Ok(fileShares);
        }
    }
}
