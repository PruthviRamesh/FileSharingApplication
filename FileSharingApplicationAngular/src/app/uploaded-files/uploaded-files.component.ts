import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-uploaded-files',
  templateUrl: './uploaded-files.component.html',
  styleUrls: ['./uploaded-files.component.css']
})
export class UploadedFilesComponent implements OnInit {
  files: any[] = [];
  userId: any;
  currentUser: any;
  users: any;
  retentiondate = {
    retentionDate: ''
  };

  constructor(private fileService: FileService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = localStorage.getItem('email');

    if (email) {
      this.fileService.getUserByEmail(JSON.parse(email)).subscribe(
        (data: any) => {
          this.userId = data.userId;
          this.fetchFiles();
        },
        (error) => {
          console.error('Failed to fetch user by email:', error);
        }
      );
    }
    this.fetchFiles();
    this.fileService.getAllUsers().subscribe(
      (users: any) => {
        this.users = users.filter((u: any) => u.userId !== this.userId);
      },
      (error) => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  fetchFiles(): void {
    if (this.userId) {
      this.fileService.getFileByUSerid(this.userId).subscribe(
        (response: any) => {
          this.files = response;
          this.files.forEach(file => {
            file.showShareDropdown = false;
            file.showExtendDropdown = false;
            file.newRetentionDate = null;
          });
        },
        (error) => {
          console.error('Failed to fetch files:', error);
        }
      );
    }
  }

  signOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
  }

  isImageFile(filename: string): boolean {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
  }

  isTextFile(filename: string): boolean {
    const textExtensions = ['.txt','.pdf'];
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return textExtensions.includes(ext);
  }

  isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv'];
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return videoExtensions.includes(ext);
  }

  viewFileContent(file: any): void {
    if (this.isImageFile(file.filename)) {
      window.open(file.filePath, '_blank');
    } else if (this.isVideoFile(file.filename)) {
      window.open(file.filePath, '_blank');
    } else if (this.isTextFile(file.filename)) {
      window.open(file.filePath, '_blank');
    } else {
      console.log(`Unsupported file type: ${file.filename}`);
    }
  }

  toggleShareDropdown(file: any): void {
    file.showShareDropdown = !file.showShareDropdown;
  }

  toggleExtendDropdown(file: any): void {
    file.showExtendDropdown = !file.showExtendDropdown;
  }

  shareFile(file: any): void {
    if (file.selectedUser) {
      const fileShareDetails = {
        fileId: file.id,
        sharedWithUserId: file.selectedUser.userId,
        sharedByUserId: this.userId
      };
      this.fileService.shareFile(fileShareDetails).subscribe(
        (response: any) => {
          Swal.fire({
            title: "File Shared Successfully!",
            text: "You clicked the button!",
            icon: "success"
          });
          this.fetchFiles();
        },
        (error) => {
          console.error('Failed to share file:', error);
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: " No user selected to share with!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  }

  extendRetention(file: any) {
    this.fileService.extendRetention(file.id, this.retentiondate).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Retention date extended successfully!",
          text: "You clicked the button!",
          icon: "success"
        });
        this.fetchFiles();
      },
      (error) => {
        console.error('Failed to extend retention date:', error);
      }
    );
  }

  getMinDate(file: any): string {
    const currentDate = new Date(file.retentionDate);
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.toISOString().split('T')[0];
  }
}
