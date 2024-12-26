import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import {LoginComponent} from './login/login.component';
export const appRoutes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'upload', component: FileUploadComponent }
];
