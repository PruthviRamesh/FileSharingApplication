import { Component } from '@angular/core';
import { FileService } from '../file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export default class AdminLoginComponent {
  loginDetails: any = {
    email:'',
    password:''
  }; 
  errorMessage: string = ''; 

  constructor(private fileService:FileService, private router: Router) { }

  onSubmit(): void {
    this.fileService.adminLogin(this.loginDetails)
      .subscribe({
        next: (response:any) => {
          console.log('Login successful');
          localStorage.setItem('currentUser', JSON.stringify(response.adminName));
          localStorage.setItem('email',JSON.stringify(response.email))
          this.router.navigate(['/adminPortal']);
        },
        error: (error) => {
          this.errorMessage = 'Incorrect Email or Password'; 
          console.error('Login error:', error);
        }
      });
  }
}
