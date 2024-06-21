using System;
using System.Collections.Generic;

namespace FileSharingApplication.Models;

public partial class RetentionExtension
{
    public int Id { get; set; }

    public int FileId { get; set; }

    public DateTime NewRetentionDate { get; set; }

    public DateTime ExtendedAt { get; set; }

    //public virtual File File { get; set; } = null!;
}
