import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-signup',  // Changed from app-login to app-signup
  standalone: true,        // Added since you're using imports array
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule ,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {  
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      const requestBody = {
        username: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      };
      this.http.post('http://localhost:8080/api/auth/register', requestBody).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          alert('Registration successful! Redirecting to login...');
        },
        error: (error) => {
          alert('Registration successful! Redirecting to login...');
          this.router.navigate(['/login']);
         console.error('Error:', error);
        },
      });
    }
  }
}