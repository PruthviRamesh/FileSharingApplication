namespace FileSharingApplication.Models.Data
{
    public class UserDetails
    {
        public string Username { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? Password { get; set; }

        public string Department { get; set; } = null!;
    }
}
