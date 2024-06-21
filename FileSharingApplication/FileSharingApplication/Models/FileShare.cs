using System;
using System.Collections.Generic;

namespace FileSharingApplication.Models;

public partial class FileShare
{
    public int Id { get; set; }

    public int FileId { get; set; }

    public int SharedWithUserId { get; set; }

    public int SharedByUserId { get; set; }

    public DateTime SharedAt { get; set; }

    //public virtual File File { get; set; } = null!;

    //public virtual User SharedByUser { get; set; } = null!;

    //public virtual User SharedWithUser { get; set; } = null!;
}
