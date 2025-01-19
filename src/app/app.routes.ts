import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PropertyDetailsComponent } from './home/PropertyDetailsComponent';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'property/:id', component: PropertyDetailsComponent},
  { path: 'dashboard', component: DashboardComponent },
];