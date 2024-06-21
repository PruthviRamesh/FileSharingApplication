namespace FileSharingApplication.Models;

public partial class File
{
    public int Id { get; set; }

    public string Filename { get; set; } = null!;

    public string FilePath { get; set; } = null!;

    public int UploadedBy { get; set; }

    public DateTime UploadedAt { get; set; }

    public DateTime? RetentionDate { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    public long FileSize { get; set; }

    //public virtual ICollection<FileShare> FileShares { get; set; } = new List<FileShare>();

    //public virtual ICollection<RecycleBin> RecycleBins { get; set; } = new List<RecycleBin>();

    //public virtual User UploadedByNavigation { get; set; } = null!;
}
