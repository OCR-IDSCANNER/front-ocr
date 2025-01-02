import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-two-factor',
  standalone: true, 
  imports: [FormsModule], 

  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent {
  otp: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  onSubmit() {
    if (this.otp === '123456') {
      // Simulating success
      this.successMessage = 'OTP Verified Successfully!';
      this.errorMessage = '';
    } else {
      // Simulating failure
      this.errorMessage = 'Invalid OTP!';
      this.successMessage = '';
    }
  }
}



/*import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html',
})
export class TwoFactorComponent {
  otp: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  verifyOTP(): void {
    this.http.post('/api/verify-otp', { otp: this.otp }).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || 'OTP Verified Successfully!';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Invalid OTP!';
        this.successMessage = '';
      },
    });
  }
}
*/