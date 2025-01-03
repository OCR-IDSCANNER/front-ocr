import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { SignupComponent } from './components/signup/signup.component';
import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import { TwoFactorComponent } from './components/two-factor/two-factor.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'upload', component: FileUploadComponent },
  { path: '2fa', component: TwoFactorComponent },
  { path: 'signup', component: SignupComponent }

];
