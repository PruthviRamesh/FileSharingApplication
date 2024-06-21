namespace FileSharingApplication.Models.Data
{
    public class FileUploadDetails
    {
        public IFormFile File { get; set; }
        public int UploadedByUserId { get; set; }
        public bool IsPermanent { get; set; } = false;
        public DateTime? RetentionDate { get; set; }
    }
}
