import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recyclebin',
  templateUrl: './recyclebin.component.html',
  styleUrls: ['./recyclebin.component.css']
})
export class RecyclebinComponent implements OnInit {
  recycleBinFiles: any[] = [];
  userId: any;
  currentUser: any;
  selectedFile: any;
  showRestoreOptionsDialog: boolean = false;
  showRetentionDialog: boolean = false;
  retentionDate: any;
  minRetentionDate: string | null = null; 

  constructor(private fileService: FileService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = localStorage.getItem('email');

    if (email) {
      this.fileService.getUserByEmail(JSON.parse(email)).subscribe(
        (data: any) => {
          this.userId = data.userId;
          this.fetchRecycleBinFiles(); 
        },
        (error) => console.error('Failed to fetch user by email:', error)
      );
    }
  }

  fetchRecycleBinFiles(): void {
    if (this.userId) {
      this.fileService.getrecycleBinFile(this.userId).subscribe(
        (response: any) => {
          this.recycleBinFiles = response;
        },
        (error) => console.error('Failed to fetch recycle bin files:', error)
      );
    }
  }

  restoreFilePermanently(selected: any): void {
    const restoreDetail = {
      restorePermanently: true,
      retentionDate: null 
    };
    
    this.fileService.restoreFile(selected.fileId, restoreDetail).subscribe(
      (response) => {
        Swal.fire({
          title: "Restored file Permanently",
          text: "You clicked the button!",
          icon: "success"
        });
        this.fetchRecycleBinFiles(); 
        this.cancelRestoreOptions(); 
      },
      (error) => {
        console.error('Failed to restore file permanently:', error);
        alert(`File restoration failed: ${error.message}`);
      }
    );
  }
  
  showRestoreOptions(file: any): void {
    console.log('Showing restore options for file:', file); 
    this.selectedFile = file;
    this.showRestoreOptionsDialog = true; 
  }

  showRetentionDateDialog(file: any): void {
    console.log('Showing retention date dialog for file:', file); 
    this.selectedFile = file;
    this.showRestoreOptionsDialog = false; 
    this.showRetentionDialog = true; 
    this.retentionDate = null; 
    this.calculateMinRetentionDate(); 
  }

  calculateMinRetentionDate(): void {
    const today = new Date();
    this.minRetentionDate = today.toISOString().split('T')[0];
  }

  cancelRetentionDateDialog(): void {
    this.showRetentionDialog = false;
    this.selectedFile = null;
    this.retentionDate = null;
  }

  restoreFileWithRetention(): void {
    console.log('Restoring file with retention:', this.selectedFile); 
    if (!this.retentionDate) {
      alert('Please select a retention date.');
      return;
    }
  
    if (!this.selectedFile || !this.selectedFile.fileId) {
      console.error('Selected file ID is undefined');
      return;
    }
  
    const restoreDetail = {
      restorePermanently: false,
      retentionDate: this.retentionDate.toISOString() 
    };
  
    this.fileService.restoreFile(this.selectedFile.fileId, restoreDetail).subscribe(
      (response) => {
        Swal.fire({
          title: "Restored file Successfull!",
          text: "You clicked the button!",
          icon: "success"
        });
        this.fetchRecycleBinFiles(); 
        this.cancelRetentionDateDialog(); 
        this.cancelRestoreOptions(); 
      },
      (error) => console.error('Failed to restore file with retention:', error)
    );
  }
  
  setRetentionDate(event: any): void {
    this.retentionDate = new Date(event.target.value);
  }

  cancelRestoreOptions(): void {
    this.showRestoreOptionsDialog = false;
    this.selectedFile = null;
    this.retentionDate = null;
  }

  deletePermanently(file: any) {
    console.log('Deleting file permanently:', file); 
    this.fileService.deletefilepermanently(file.fileId).subscribe(
      (response: any) => {
        Swal.fire({
          title: "Deleted file Successfull!",
          text: "You clicked the button!",
          icon: "success"
        });
        this.fetchRecycleBinFiles(); 
      },
      (error) => console.error('Failed to delete file permanently:', error)
    );
  }

  signOut(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
  }
}
