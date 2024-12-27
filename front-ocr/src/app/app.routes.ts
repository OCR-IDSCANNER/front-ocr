import { Routes } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [  
  { path: '', redirectTo: '/signup', pathMatch: 'full' }, 
  { path: 'upload', component: FileUploadComponent },
  { path: 'signup', component: SignupComponent }
];