import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SignupComponent } from './components/signup/signup.component';
import { Routes } from '@angular/router';
export const appRoutes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: 'upload', component: FileUploadComponent },
  { path: 'signup', component: SignupComponent }
];
