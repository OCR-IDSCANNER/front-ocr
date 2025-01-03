import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-factor-setup',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './two-factor.component.html',
  styleUrls: ['./two-factor.component.css']
})
export class TwoFactorComponent implements OnInit {
  
  qrCodeUrl: string = ''; // To store the QR code image URL
  errorMessage: string = '';
  successMessage: string = '';
  otp: string = ''; // To store the user-entered OTP
  secret: string = ''; // To store the TOTP secret
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.generateQRCode();
  }

  generateQRCode() {
    // Call the /generate endpoint to get the secret and TOTP URL
    this.http.post<{ secret: string; url: string }>('http://localhost:8181/generate', {}).subscribe({
      next: (response) => {
        this.secret = response.secret;
        // Use the secret to fetch the QR code
        this.qrCodeUrl = `http://localhost:8181/qr/${response.secret}`;
      },
      error: (error) => {
        this.errorMessage = 'Error generating QR code.';
        console.error(error);
      }
    });
  }

  onSubmit() {
    // Verify the OTP entered by the user
    const payload = { secret: this.secret, code: this.otp };
    this.http.post<{ valid: boolean }>('http://localhost:8181/verify', payload).subscribe({
      next: (response) => {
        if (response.valid) {
          this.successMessage = 'OTP verified successfully!';
          this.router.navigate(['/upload']);
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Invalid OTP. Please try again.';
          this.successMessage = '';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error verifying OTP.';
        console.error(error);
      }
    });
  }
}
