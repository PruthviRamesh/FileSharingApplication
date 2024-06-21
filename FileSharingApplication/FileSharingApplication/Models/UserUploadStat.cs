using System;
using System.Collections.Generic;

namespace FileSharingApplication.Models;

public partial class UserUploadStat
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateOnly Date { get; set; }

    public long TotalUploadedBytes { get; set; }

    //public virtual User User { get; set; } = null!;
}
