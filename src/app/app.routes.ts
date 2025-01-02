import { LoginComponent } from '../../front-ocr/src/app/login/login.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SignupComponent } from './components/signup/signup.component';
import { Routes } from '@angular/router';
export const appRoutes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: 'signup', component: SignupComponent }
];
