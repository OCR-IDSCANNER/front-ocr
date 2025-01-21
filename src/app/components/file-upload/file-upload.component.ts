import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
import { QrCodeComponent } from 'ng-qrcode';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, QrCodeComponent, ImageCropperComponent],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @ViewChild('cameraInput') cameraInput!: ElementRef;
  
  originalImage: string | ArrayBuffer | null = null;  // Store original image
  selectedImage: string | ArrayBuffer | null = null;  // Display image (either original or cropped)
  imageFile: File | null = null;
  apiResponse: any = {};
  showQRModal: boolean = false;
  qrCodeData: string = '';
  username: string = '';
  isMobile: boolean = false;

  showCropper: boolean = false;
  croppedImage: any = '';
  imageChangedEvent: any = '';
  
  cardType: boolean = false;
  studentName: string = '';
  schoolYear: string = '';
  studentLevel: string = '';
  schoolAdress: string = '';
  idCode: string = '';

  imageStyles = {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'contain' as const
  };
  
  isLoading: boolean | undefined;
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.checkIfMobile();
    this.getUsernameFromToken();
  }

  checkIfMobile() {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  getUsernameFromToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const userData = JSON.parse(decodedPayload);
        this.username = userData.username || userData.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.username = 'User';
      }
    }
  }

  openCamera() {
    if (this.isMobile) {
      this.cameraInput.nativeElement.click();
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    console.log('Cropped event:', event);
    
    if (event.objectUrl && event.blob) {
      // Store the blob URL for preview
      this.croppedImage = event.objectUrl;
      
      // Create File directly from the blob
      this.imageFile = new File([event.blob], 'cropped_image.png', { type: 'image/png' });
    } else if (event.base64) {
      // Fallback to base64 if objectUrl is not available
      this.croppedImage = event.base64;
      
      // Convert base64 to blob
      const byteString = atob(event.base64.split(',')[1]);
      const mimeString = event.base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      this.imageFile = new File([blob], 'cropped_image.png', { type: 'image/png' });
    }
  }

  loadImageFailed() {
    console.error('Failed to load image');
  }

  finishCropping() {
    if (this.croppedImage) {
      // Update the preview with the cropped image
      this.selectedImage = this.croppedImage;
      // Hide the cropper
      this.showCropper = false;
    }
  }

  cancelCropping() {
    this.showCropper = false;
    // Keep the original image when canceling crop
    if (this.originalImage) {
      this.selectedImage = this.originalImage;
      // Convert original image back to File if needed
      fetch(this.originalImage.toString())
        .then(res => res.blob())
        .then(blob => {
          this.imageFile = new File([blob], 'original_image.png', { type: 'image/png' });
        })
        .catch(error => {
          console.error('Error converting original image:', error);
        });
    }
  }
  
  onFileSelect(event: Event): void {
    this.imageChangedEvent = event;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageFile = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.originalImage = reader.result;  // Store original image
        this.selectedImage = reader.result;  // Display original image
        this.showCropper = true;  // Show cropper but user can cancel if they don't want to crop
      };

      reader.readAsDataURL(file);
    }
  }

  toggleQRModal() {
    this.showQRModal = !this.showQRModal;
  }

  onMobileScan() {
    this.toggleQRModal();
  }

  closeModal() {
    this.showQRModal = false;
  }

  // Update the onSubmit method in file-upload.component.ts
onSubmit(): void {
  if (!this.imageFile) {
    console.error('No image selected!');
    return;
  }

  const formData = new FormData();
  formData.append('image', this.imageFile);

  // Add loading state
  this.isLoading = true;

  this.http.post('http://localhost:8180/ocr', formData, {
    headers: {
      // Remove Content-Type header to let browser set it with boundary
      Accept: 'application/json',
    },
    // Add timeout and response type
    observe: 'response',
    responseType: 'json'
  }).subscribe({
    next: (response) => {
      console.log('API Response:', response.body);
      this.apiResponse = response.body;
      if (this.apiResponse) {
        this.studentName = this.apiResponse.nom_etudiant || '';
        this.schoolYear = this.apiResponse.annee_unv || '';
        this.studentLevel = this.apiResponse.niveau || '';
        this.schoolAdress = '5 Lot Bouizgren-Route de Safi Marrakech';
        this.cardType = this.apiResponse.is_student_card || false;
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error:', error);
      // Add error handling
      if (error.status === 0) {
        alert('Unable to connect to the server. Please check if the server is running.');
      } else {
        alert(`Error processing image: ${error.error?.detail || 'Unknown error'}`);
      }
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });
}

  onSubmit2():void{
    const requestBody = {
      cardType: this.cardType,
      studentName: this.studentName,
      schoolYear: this.schoolYear,
      studentLevel: this.studentLevel,
      schoolAdress: this.schoolAdress,
    };
    this.http.post('http://localhost:8081/api/card', requestBody).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.apiResponse = response;
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  generatePDF(): void {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font
    doc.setFont("helvetica");
    
    // Add title
    doc.setFontSize(20);
    doc.text("Student Information Card", 105, 20, { align: 'center' });
    
    // Set font size for content
    doc.setFontSize(12);
    
    // Add content with proper spacing
    const startY = 40;
    const lineHeight = 10;
    
    // Add school logo/header
    doc.setFontSize(16);
    doc.text("School Information", 20, startY);
    doc.setFontSize(12);
    
    // Add a line under the header
    doc.setLineWidth(0.5);
    doc.line(20, startY + 5, 190, startY + 5);
    
    // Add form information
    let currentY = startY + 20;
    
    doc.text(`Student Card Type: ${this.cardType ? 'Valid' : 'Invalid'}`, 20, currentY);
    currentY += lineHeight + 5;
    
    doc.text(`Student Name: ${this.studentName}`, 20, currentY);
    currentY += lineHeight + 5;
    
    doc.text(`School Year: ${this.schoolYear}`, 20, currentY);
    currentY += lineHeight + 5;
    
    doc.text(`School Level: ${this.studentLevel}`, 20, currentY);
    currentY += lineHeight + 5;
    
    doc.text(`School Address: ${this.schoolAdress}`, 20, currentY);
    currentY += lineHeight + 15;
    
    // Add footer
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated on: ${currentDate}`, 20, 280);
    
    // Save PDF
    doc.save('student_information.pdf');
  }

  clearSelection(): void {
    this.selectedImage = null;
    this.imageFile = null;
    this.apiResponse = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.imageFile = file;
      this.imageChangedEvent = { target: { files: [file] } };
      const reader = new FileReader();

      reader.onload = () => {
        this.originalImage = reader.result;
        this.selectedImage = reader.result;
        this.showCropper = true;
      };

      reader.readAsDataURL(file);
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (event.clipboardData) {
      const items = event.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            this.imageFile = file;
            this.imageChangedEvent = { target: { files: [file] } };
            const reader = new FileReader();

            reader.onload = () => {
              this.originalImage = reader.result;
              this.selectedImage = reader.result;
              this.showCropper = true;
            };

            reader.readAsDataURL(file);
          }
        }
      }
    }
  }

  logout(){
    localStorage.removeItem('token');
    alert('Logout successful! Redirecting to login...');
    this.router.navigate(['/login']);
  }
}