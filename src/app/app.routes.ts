import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PropertyDetailsComponent } from './home/PropertyDetailsComponent';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PropertyReservationsComponent } from './dashboard/property.reservations.component';
import { AdminDashboardComponent } from './admin/admin.dashboard.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'property/:id', component: PropertyDetailsComponent },
  
  // Protected routes
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'properties/:id/reservations', 
    component: PropertyReservationsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admindashboard', 
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  
  // Wildcard route for 404
  { path: '**', redirectTo: 'home' }
];