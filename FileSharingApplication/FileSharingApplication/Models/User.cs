using System;
using System.Collections.Generic;

namespace FileSharingApplication.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Password { get; set; }

    public string Department { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    //public virtual ICollection<FileShare> FileShareSharedByUsers { get; set; } = new List<FileShare>();

    //public virtual ICollection<FileShare> FileShareSharedWithUsers { get; set; } = new List<FileShare>();

    //public virtual ICollection<File> Files { get; set; } = new List<File>();

    //public virtual ICollection<UserUploadStat> UserUploadStats { get; set; } = new List<UserUploadStat>();
}
