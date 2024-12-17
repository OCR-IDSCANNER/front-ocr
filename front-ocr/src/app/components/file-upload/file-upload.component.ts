import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import de CommonModule nécessaire pour *ngIf

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule], // Importer CommonModule pour les directives comme *ngIf
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  fileUrl: string = ''; // Déclaration pour ngModel

  selectedImage: string | ArrayBuffer | null = null;

  // Méthode pour gérer la sélection de fichier
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result; // Contient l'URL de l'image en base64
      };

      reader.readAsDataURL(file); // Charge le fichier comme URL base64
    }
  }

  // Méthode pour réinitialiser la sélection
  clearSelection(): void {
    this.selectedImage = null;
    this.fileUrl = ''; // Réinitialise également l'URL manuelle si nécessaire
  }

  // Méthode pour gérer le submit
  onSubmit(): void {
    console.log('Image submitted:', this.selectedImage);
    // Logique de traitement après soumission
  }
}
