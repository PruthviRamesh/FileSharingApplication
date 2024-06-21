import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../file.service';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginDetails: any = {
    email:'',
    password:''
  };
  errorMessage: string = ''; 

  constructor(private fileService:FileService, private router: Router) { }
  onSubmit(): void {
    this.fileService.loginUser(this.loginDetails)
      .subscribe({
        next: (response:any) => {
          console.log('Login successful');
          localStorage.setItem('currentUser', JSON.stringify(response.username));
          localStorage.setItem('email',JSON.stringify(response.email))
          this.router.navigate(['/userPortal']);
        },
        error: (error) => {
          this.errorMessage = 'Incorrect Email or Password'; 
          console.error('Login error:', error);
        }
      });
    signInWithEmailAndPassword(auth,this.loginDetails.email,this.loginDetails.password).then((response)=>{
      console.log(response);
      this.router.navigate(['/userPortal']);
    }).catch((data)=>{
      this.errorMessage = 'Incorrect Email or Password';
      console.log(data)})
  }
}
