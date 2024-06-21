using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace FileSharingApplication.Models;

public partial class FileSharingDbContext : DbContext
{
    public FileSharingDbContext()
    {
    }

    public FileSharingDbContext(DbContextOptions<FileSharingDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<File> Files { get; set; }

    public virtual DbSet<FileShare> FileShares { get; set; }

    public virtual DbSet<RecycleBin> RecycleBins { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserUploadStat> UserUploadStats { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-V2JOIOB\\SQLEXPRESS; Initial Catalog=FileSharingDb; Integrated Security=True; TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.AdminId).HasName("PK__Admin__719FE488ED685F20");

            entity.ToTable("Admin");

            entity.Property(e => e.AdminName).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<File>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Files__3214EC07A5E117EF");

            entity.Property(e => e.DeletedAt).HasColumnType("datetime");
            entity.Property(e => e.Filename).HasMaxLength(255);
            entity.Property(e => e.RetentionDate).HasColumnType("datetime");
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            //entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Files)
            //    .HasForeignKey(d => d.UploadedBy)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__Files__UploadedB__42E1EEFE");
        });

        modelBuilder.Entity<FileShare>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FileShar__3214EC078B0F02D1");

            entity.Property(e => e.SharedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            //entity.HasOne(d => d.File).WithMany(p => p.FileShares)
            //    .HasForeignKey(d => d.FileId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__FileShare__FileI__46B27FE2");

            //entity.HasOne(d => d.SharedByUser).WithMany(p => p.FileShareSharedByUsers)
            //    .HasForeignKey(d => d.SharedByUserId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__FileShare__Share__489AC854");

            //entity.HasOne(d => d.SharedWithUser).WithMany(p => p.FileShareSharedWithUsers)
            //    .HasForeignKey(d => d.SharedWithUserId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__FileShare__Share__47A6A41B");
        });

        modelBuilder.Entity<RecycleBin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__RecycleB__3214EC071F04B17C");

            entity.ToTable("RecycleBin");

            entity.Property(e => e.DeletedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            //entity.HasOne(d => d.File).WithMany(p => p.RecycleBins)
            //    .HasForeignKey(d => d.FileId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK__RecycleBi__FileI__4C6B5938");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CFA6E2B35");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Department).HasMaxLength(50);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Username).HasMaxLength(50);
        });

        modelBuilder.Entity<UserUploadStat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserUplo__3214EC07CDEE086A");

            //entity.HasOne(d => d.User).WithMany(p => p.UserUploadStats)
            //    .HasForeignKey(d => d.UserId)
            //    .OnDelete(DeleteBehavior.ClientSetNull)
            //    .HasConstraintName("FK_UserUploadStats_UserId");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
