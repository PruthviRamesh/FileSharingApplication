import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileService } from '../file.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  @Output() fileUploaded = new EventEmitter<void>();

  fileToUpload: File | null = null;
  isPermanent: boolean | null = null;
  retentionDate: string | null = null;
  showProgress: boolean = false;
  uploadProgress: number = 0;
  currentUser: any;
  today: Date = new Date();
  email: any;
  uploadedUserId: any;

  constructor(private fileService: FileService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.email = JSON.parse(localStorage.getItem('email') || '{}');
    this.fileService.getUserByEmail(this.email).subscribe((data: any) => {
      this.uploadedUserId = data.userId;
    });
  }

  onSubmit() {
    if (!this.fileToUpload) {
      alert('Please select a file.');
      return;
    }

    if (this.isPermanent === null) {
      alert('Please select Permanent Storage option.');
      return;
    }

    this.showProgress = true;

    const interval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10;
      } else {
        clearInterval(interval);
        Swal.fire({
          title: "File Uploaded Successfully!",
          text: "You clicked the button!",
          icon: "success"
        });
        this.uploadProgress = 0;
        this.showProgress = false;
        this.fileToUpload = null;
        this.isPermanent = null;
        this.retentionDate = null;
        this.fileUploaded.emit();
      }
    }, 500);

    this.fileService.uploadFile(
      this.fileToUpload,
      this.uploadedUserId,
      this.isPermanent,
      this.retentionDate
    ).subscribe(
      (response) => {
        this.fileUploaded.emit(); 
        this.router.navigate(['/uploaded-files']);
      },
      (error) => {
        console.error('File upload failed:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: " Todays limit of 3Mb is completed!",
          footer: '<a href="#">Why do I have this issue?</a>'
        });
        clearInterval(interval);
        this.uploadProgress = 0;
        this.showProgress = false;
      }
    );
  }

  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  signOut() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('email');
    this.router.navigate(['/signin']);
  }

  get isRetentionDateDisabled(): boolean {
    return this.isPermanent === true;
  }
}
