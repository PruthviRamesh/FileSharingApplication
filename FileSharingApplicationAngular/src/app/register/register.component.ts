import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../file.service';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: any = { username: '', email: '', password: '', department: '' };
  errorMessage: string = ''; 

  constructor(private fileService: FileService, private router: Router) { }

  onSubmit() {
    createUserWithEmailAndPassword(auth,this.user.email,this.user.password).then((response)=>{
      console.log(response);
      this.fileService.registerUser(this.user)
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            title: "Registration Successfull!",
            text: "You clicked the button!",
            icon: "success"
          });
          this.router.navigate(['/signin']);
        },
        error: (error: any) => {
          this.errorMessage = 'There is already an account with these credentials';
          console.error('Registration error:', error);
        }
      });
    })
    .catch((error)=>{
      console.log(error)
      this.errorMessage = 'There is already an account with these credentials!';});
  }

  validatePassword(password: string): boolean {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    return regex.test(password);
  }
}

