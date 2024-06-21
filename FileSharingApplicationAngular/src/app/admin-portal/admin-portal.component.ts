import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-portal',
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.css']
})
export class AdminPortalComponent implements OnInit {
  activeTab: any;
  Users: any;
  allFiles: any[] = [];
  fileStats: { text: number, video: number, image: number } = { text: 0, video: 0, image: 0 };
  uploadedFilesChartData: { date: string, totalFiles: number }[] = [];
  sharedFilesChartData: { date: string, totalFiles: number }[] = [];
  currentUser:any;
  constructor(private route: ActivatedRoute, private service: FileService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.route.paramMap.subscribe(params => {
      this.activeTab = 'dashboard';
    });
    this.loadUsers();
    this. loadAllFiles();
    this.loadUploadedFilesChartData();
    this.loadSharedFilesChartData();
  }

  loadUsers() {
    this.service.getAllUsers().subscribe((data) => {
      this.Users = data;
    });
  }

  loadAllFiles() {
    this.service.getAllFiles().subscribe((data: any) => {
      this.allFiles = data;
      this.calculateFileStats();
    });
  }

  calculateFileStats() {
    this.fileStats = { text: 0, video: 0, image: 0 };
    for (let file of this.allFiles) {
      if (this.isTextFile(file.filename)) {
        this.fileStats.text++;
      } else if (this.isVideoFile(file.filename)) {
        this.fileStats.video++;
      } else if (this.isImageFile(file.filename)) {
        this.fileStats.image++;
      }
    }
  }

  isTextFile(filename: string): boolean {
    const FileExtensions = ['.txt', '.pdf'];
    return FileExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  isVideoFile(filename: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mov'];
    return videoExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'view-all-files') {
      this.loadAllFiles();
    }
  }

  signOut() {
    console.log('Admin signed out');
    this.router.navigate(['/signin']);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.service.deleteUser(userId).subscribe(
        () => {
          Swal.fire({
            title: "User Deleted Successfull!",
            text: "You clicked the button!",
            icon: "success"
          });
          this.Users = this.Users.filter((user: any) => user.userId !== userId);
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  loadUploadedFilesChartData() {
    this.service.getUploadedFilesChartData().subscribe((data: any) => {
      this.uploadedFilesChartData = data.map((item: any) => ({
        date: item.date,
        totalFiles: item.totalFiles
      }));
    });
  }

  loadSharedFilesChartData() {
    this.service.getSharedFilesChartData().subscribe((data: any) => {
      this.sharedFilesChartData = data.map((item: any) => ({
        date: item.date,
        totalFiles: item.totalShares 
      }));
    });
  }
}
