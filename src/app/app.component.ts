import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileUploadComponent } from './components/file-upload/file-upload.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,FileUploadComponent],
  template: `
    <div>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
