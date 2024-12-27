import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SignupComponent } from './components/signup/signup.component';
import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
export const appRoutes: Routes = [
  { path: '', redirectTo: '/signup', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: 'signup', component: SignupComponent }
];
