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
qrCodeUrl: any;

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



