import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'upload', component: FileUploadComponent },
];
