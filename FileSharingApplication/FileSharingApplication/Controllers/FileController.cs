using Microsoft.AspNetCore.Mvc;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using FileSharingApplication.Models;
using FileSharingApplication.Models.Data;

namespace FileSharingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileSharingDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly BlobServiceClient _blobServiceClient;

        public FileController(FileSharingDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            string connectionString = _configuration.GetConnectionString("AzureBlobStorage");
            _blobServiceClient = new BlobServiceClient(connectionString);
        }
        [HttpGet("view/{fileName}")]
        public async Task<IActionResult> ViewFile(string fileName)
        {
            try
            {
                var containerName = _configuration["AzureBlobStorage:ContainerName"];
                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = containerClient.GetBlobClient(fileName);
                if (!await blobClient.ExistsAsync())
                {
                    return NotFound();
                }
                var response = await blobClient.DownloadAsync();
                string contentType = GetContentType(fileName);
                Response.Headers["Content-Disposition"] = "inline"; 
                Response.Headers["Content-Type"] = contentType; 
                Response.Headers["Accept-Ranges"] = "bytes"; 
                return File(response.Value.Content, contentType);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        private string GetContentType(string fileName)
        {
            string contentType = "application/octet-stream"; 

            string fileExtension = Path.GetExtension(fileName)?.ToLowerInvariant();
            switch (fileExtension)
            {
                case ".pdf":
                    contentType = "application/pdf";
                    break;
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".webp":
                    contentType = "image/webp";
                    break;
                case ".txt":
                    contentType = "text/plain";
                    break;
                case ".html":
                    contentType = "text/html";
                    break;
                case ".mp4":
                    contentType = "video/mp4";
                    break;
                case ".avi":
                    contentType = "video/x-msvideo";
                    break;
                case ".mov":
                    contentType = "video/quicktime";
                    break;
                case ".wmv":
                    contentType = "video/x-ms-wmv";
                    break;
                default:
                    break;
            }

            return contentType;
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(FileUploadDetails fileUploadDto)
        {
            try
            {
                var file = fileUploadDto.File;
                var uploadedByUserId = fileUploadDto.UploadedByUserId;
                var isPermanent = fileUploadDto.IsPermanent;
                var retentionDate = fileUploadDto.RetentionDate;

                long fileSizeInBytes = file.Length;
                long maxSizePerUploadInBytes = 3* 1024 * 1024;
                if (fileSizeInBytes > maxSizePerUploadInBytes)
                {
                    return BadRequest("File size exceeds the allowed limit per upload (100 KB).");
                }
                var today = DateOnly.FromDateTime(DateTime.Today);
                var userUploadStats = _context.UserUploadStats
                    .FirstOrDefault(s => s.UserId == uploadedByUserId && s.Date == today);

                if (userUploadStats == null)
                {
                    userUploadStats = new UserUploadStat
                    {
                        UserId = uploadedByUserId,
                        Date = today,
                        TotalUploadedBytes = fileSizeInBytes
                    };
                    _context.UserUploadStats.Add(userUploadStats);
                }
                else
                {
                    userUploadStats.TotalUploadedBytes += fileSizeInBytes;
                }
                if (userUploadStats.TotalUploadedBytes > maxSizePerUploadInBytes)
                {
                    return BadRequest("Daily upload limit exceeded.");
                }

                string containerName = _configuration["AzureBlobStorage:ContainerName"];
                var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

                var fileName = Path.GetFileName(file.FileName);
                var blobClient = containerClient.GetBlobClient(fileName);
                string contentType = GetContentType(fileName);

                using (var stream = file.OpenReadStream())
                {
                    var options = new BlobUploadOptions
                    {
                        HttpHeaders = new BlobHttpHeaders
                        {
                            ContentType = contentType,
                            ContentDisposition = "inline" 
                        }
                    };

                    await blobClient.UploadAsync(stream, options, cancellationToken: default);
                }
                var newFile = new Models.File
                {
                    Filename = fileName, 
                    FilePath = blobClient.Uri.ToString(), 
                    UploadedBy = uploadedByUserId,
                    UploadedAt = DateTime.UtcNow,
                    FileSize = fileSizeInBytes,
                };

                if (!isPermanent && retentionDate.HasValue)
                {
                    newFile.RetentionDate = retentionDate.Value;
                }

                _context.Files.Add(newFile);
                _context.SaveChanges();
                return Ok(newFile);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpPut("extendRetention/{fileId}")]
        public IActionResult ExtendRetention(int fileId, ExtendRetention retention)
        {
                var file = _context.Files.Find(fileId);
                if (file == null)
                {
                    return NotFound("File not found.");
                }

                file.RetentionDate = retention.RetentionDate;
                _context.SaveChanges();

                return Ok();
        }

        [HttpGet("listFiles")]
        public IActionResult ListFiles()
        {
                var currentDate = DateOnly.FromDateTime(DateTime.Today);
                var files = _context.Files
                    .ToList() 
                    .Select(file =>
                    {
                        if (file.RetentionDate.HasValue && DateOnly.FromDateTime(file.RetentionDate.Value) <= currentDate && !file.IsDeleted)
                        {
                            file.IsDeleted = true;
                            file.DeletedAt = DateTime.UtcNow;

                            var recycleBinEntry = new RecycleBin
                            {
                                FileId = file.Id,
                                DeletedAt = DateTime.UtcNow
                            };
                            _context.RecycleBins.Add(recycleBinEntry);
                        }
                        return file;
                    })
                    .ToList(); 
                _context.SaveChanges(); 

                return Ok(files);
        }

        [HttpGet("getFilesByUserId/{userId}")]
        public IActionResult GetFilesByUserId(int userId)
        {
                var files = _context.Files
                    .Where(f => f.UploadedBy == userId && f.IsDeleted == false)
                    .ToList();

                if (files == null || files.Count == 0)
                {
                    return NotFound("No files found for the specified user.");
                }

                return Ok(files);
        }
 
        [HttpGet("getFileContent/{fileName}")]
        public async Task<IActionResult> GetFileContent(string fileName)
        {
            try
            {
                var file = _context.Files.FirstOrDefault(f => f.Filename == fileName && !f.IsDeleted);
                if (file == null)
                {
                    return BadRequest();
                }
                var blobUri = new Uri(file.FilePath);
                var blobClient = new BlobClient(blobUri);
                var downloadResponse = await blobClient.DownloadContentAsync();

                string contentType = GetContentType(fileName);
                Response.Headers["Content-Disposition"] = "inline"; 
                Response.Headers["Content-Type"] = contentType;
                Response.Headers["Accept-Ranges"] = "bytes";
                return File(downloadResponse.Value.Content.ToArray(), contentType);
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
