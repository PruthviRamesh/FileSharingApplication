import { Component, OnInit } from '@angular/core';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-management',
  templateUrl: './file-management.component.html',
  styleUrls: ['./file-management.component.css']
})
export class FileManagementComponent implements OnInit {
  selectedUserFiles: any[] = [];
  Users: any;
  distinctDepartments: string[] = []; 
  activeTab: string = 'username';
  selectedUsername: string = ''; 
  selectedDepartment: string = ''; 
  selectedDate: string = ''; 
  tempSelectedUsername: string = '';
  tempSelectedDepartment: string = '';
  tempSelectedDate: string = '';
  submitted: boolean = false;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.loadUsers(); 
  }

  loadUsers() {
    this.fileService.getAllUsers().subscribe((data) => {
      this.Users = data;
      this.extractDistinctDepartments(); 
      console.log(data);
    });
  }

  extractDistinctDepartments() {
    const departmentSet = new Set<string>();
    this.Users.forEach((user:any )=> {
      departmentSet.add(user.department);
    });
    this.distinctDepartments = Array.from(departmentSet);
  }

  loadFilesByUser() {
    this.submitted = true;
    this.selectedUserFiles = [];
    this.selectedUsername = this.tempSelectedUsername;
    if (this.selectedUsername) {
      this.fileService.getFileByUsername(this.selectedUsername).subscribe((data: any) => {
        this.selectedUserFiles = data;
        console.log(data);
      });
    } else {
      this.selectedUserFiles = [];
    }
  }

  loadFilesByDepartment() {
    this.submitted = true;
    this.selectedUserFiles = [];
    this.selectedDepartment = this.tempSelectedDepartment;
    if (this.selectedDepartment) {
      this.fileService.getFileByDepartment(this.selectedDepartment).subscribe((data: any) => {
        this.selectedUserFiles = data;
        console.log(data);
      });
    } else {
      this.selectedUserFiles = [];
    }
  }

  loadFilesByDate() {
    this.submitted = true;
    this.selectedDate = this.tempSelectedDate;
    if (this.selectedDate) {
      this.fileService.getFileByDate(this.selectedDate).subscribe((data: any) => {
        this.selectedUserFiles = data;
        console.log(data);
        if (this.selectedUserFiles.length === 0) {
          console.log('No files found');
          this.selectedUserFiles = [];
        }
      }, error => {
        console.error('Error fetching files by date', error);
        this.selectedUserFiles = [];
      });
    } else {
      this.selectedUserFiles = [];
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.selectedUserFiles = []; 
    this.submitted = false; 
    this.tempSelectedUsername = '';
    this.tempSelectedDepartment = '';
    this.tempSelectedDate = '';
  }
}
