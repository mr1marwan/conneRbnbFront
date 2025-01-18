import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http'; // Add this import

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // Add this line to provide HttpClient
    importProvidersFrom(RouterModule.forRoot(routes))
  ]
}).catch(err => console.error(err));