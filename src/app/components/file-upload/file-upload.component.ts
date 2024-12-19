import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  studentName: string = '';
  schoolYear: string = '';
  studentLevel: string = '';
  schoolAdress: string = '';
  idCode: string = '';

  constructor(private http: HttpClient) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; 
      };

      reader.readAsDataURL(this.imageFile); 
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
        this.schoolAdress = this.apiResponse?.text || '';
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
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
