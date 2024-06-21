namespace FileSharingApplication.Models.Data
{
    public class FileShareDetails
    {
        public int FileId { get; set; }

        public int SharedWithUserId { get; set; }

        public int SharedByUserId { get; set; }
    }
}
