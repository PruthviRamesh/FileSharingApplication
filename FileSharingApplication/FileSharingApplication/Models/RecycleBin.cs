using System;
using System.Collections.Generic;

namespace FileSharingApplication.Models;

public partial class RecycleBin
{
    public int Id { get; set; }

    public int FileId { get; set; }

    public DateTime DeletedAt { get; set; }

    public virtual File File { get; set; } = null!;
}
