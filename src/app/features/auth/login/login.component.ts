import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-12 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input id="email" formControlName="email" type="email" class="input-field" [ngClass]="{'border-red-500': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}">
                <p *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-2 text-sm text-red-600">Valid email is required</p>
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input id="password" formControlName="password" type="password" class="input-field" [ngClass]="{'border-red-500': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}">
                <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-2 text-sm text-red-600">Password is required</p>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid" class="w-full btn-primary" [ngClass]="{'opacity-50 cursor-not-allowed': loginForm.invalid}">Sign in</button>
            </div>
          </form>

          <!-- Success Message -->
          <div *ngIf="showSuccessMessage" class="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            <strong>Success!</strong> {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="showErrorMessage" class="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <strong>Error!</strong> {{ errorMessage }}
          </div>

          <!-- Sign Up Button -->
          <div class="mt-4">
            <button (click)="goToSignup()" class="w-full btn-secondary">Don't have an account? Sign up</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  showSuccessMessage = false;
  showErrorMessage = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8080/api/v1/auth/login', this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            console.log('Login successful:', response);
            this.successMessage = 'Login successful!';
            this.showSuccessMessage = true;
            this.showErrorMessage = false;

            // Redirect after successful login
            this.router.navigate(['/home']);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Login failed:', error);
            if (error.status === 401) {
              this.errorMessage = 'Invalid email or password. Please try again.';
            } else {
              this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
            }
            this.showErrorMessage = true;
            this.showSuccessMessage = false;
          }
        });
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.showErrorMessage = true;
      this.showSuccessMessage = false;
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']); 
  }
}