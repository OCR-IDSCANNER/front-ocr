import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Add this line
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const requestBody = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
  
      this.http.post('http://localhost:8080/api/auth/login', requestBody, {
        responseType: 'text'
      }).subscribe({
        next: (token: string) => {
          console.log('Received token:', token);
          localStorage.setItem('token', token);
          alert('Login successful! Redirecting to dashboard...');
          this.router.navigate(['/2fa']);
        },
        error: (error) => {
          console.error('Error details:', error);
          alert('An unexpected error occurred. Please try again.');
        },
      });
    }
  }
}
