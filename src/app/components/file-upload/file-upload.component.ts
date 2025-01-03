import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  selectedImage: string | ArrayBuffer | null = null; 
  imageFile: File | null = null; 
  apiResponse: any = {};

  cardType: boolean = false;
  studentName: string = '';
  schoolYear: string = '';
  studentLevel: string = '';
  schoolAdress: string = '';
  idCode: string = '';

  constructor(private http: HttpClient) {}

   // Unified image selection
   onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; // Display selected image
      };

      reader.readAsDataURL(this.imageFile); 
    }
  }

  // Opens the camera input
  openCamera(): void {
    const cameraInput = document.getElementById('cameraInput') as HTMLInputElement;
    if (cameraInput) {
      cameraInput.click();
    }
  }



  onSubmit(): void {
    if (!this.imageFile) {
      console.error('No image selected!');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.imageFile); 

    this.http.post('http://localhost:8180/ocr', formData).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.apiResponse = response;

        this.studentName = this.apiResponse?.nom_etudiant || '';
        this.schoolYear = this.apiResponse?.annee_unv || '';
        this.studentLevel = this.apiResponse?.niveau || '';
        this.schoolAdress = '5 Lot Bouizgren-Route de Safi Marrakech';
        this.cardType= this.apiResponse?.is_student_card || '';
      },
      error: (error) => {
        console.error('Error:', error);
      },
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
      this.imageFile = event.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; 
      };

      reader.readAsDataURL(this.imageFile);
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
            const reader = new FileReader();

            reader.onload = () => {
              this.selectedImage = reader.result;
            };

            reader.readAsDataURL(file);
          }
        }
      }
    }
  }
}