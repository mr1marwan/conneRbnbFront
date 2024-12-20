import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';

interface RegisterResponse {
  success: boolean;
  message: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img class="mx-auto h-12 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <div class="mt-1">
                <input id="name" formControlName="name" type="text" class="input-field" [ngClass]="{'border-red-500': signupForm.get('name')?.invalid && signupForm.get('name')?.touched}">
                <p *ngIf="signupForm.get('name')?.invalid && signupForm.get('name')?.touched" class="mt-2 text-sm text-red-600">Full name is required</p>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input id="email" formControlName="email" type="email" class="input-field" [ngClass]="{'border-red-500': signupForm.get('email')?.invalid && signupForm.get('email')?.touched}">
                <p *ngIf="signupForm.get('email')?.invalid && signupForm.get('email')?.touched" class="mt-2 text-sm text-red-600">Valid email is required</p>
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input id="password" formControlName="password" type="password" class="input-field" [ngClass]="{'border-red-500': signupForm.get('password')?.invalid && signupForm.get('password')?.touched}">
                <p *ngIf="signupForm.get('password')?.invalid && signupForm.get('password')?.touched" class="mt-2 text-sm text-red-600">Password must be at least 8 characters long</p>
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-1">
                <input id="phone" formControlName="phone" type="tel" class="input-field" [ngClass]="{'border-red-500': signupForm.get('phone')?.invalid && signupForm.get('phone')?.touched}">
                <p *ngIf="signupForm.get('phone')?.invalid && signupForm.get('phone')?.touched" class="mt-2 text-sm text-red-600">Valid phone number is required</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <div class="mt-2">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input type="radio" formControlName="role" value="client" class="h-4 w-4 text-airbnb">
                    <span class="ml-2">Client</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" formControlName="role" value="host" class="h-4 w-4 text-airbnb">
                    <span class="ml-2">Host</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="signupForm.invalid" class="w-full btn-primary" [ngClass]="{'opacity-50 cursor-not-allowed': signupForm.invalid}">Sign up</button>
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

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            <div class="mt-6">
              <a routerLink="/login" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  showSuccessMessage = false;
  showErrorMessage = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      role: ['client', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:8080/api/users/register', this.signupForm.value, { responseType: 'text' })
        .subscribe({
          next: (response: string) => {
            console.log('User registered:', response);
            this.successMessage = response || 'User registered successfully!';
            this.showSuccessMessage = true;
            this.showErrorMessage = false;
            this.resetForm();
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 3000);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Registration failed:', error);
            if (error.status === 201) {
              // This is actually a success case
              this.successMessage = error.error || 'User registered successfully!';
              this.showSuccessMessage = true;
              this.showErrorMessage = false;
              this.resetForm();
              setTimeout(() => {
                this.showSuccessMessage = false;
              }, 3000);
            } else {
              this.errorMessage = error.error || 'An error occurred during registration. Please try again.';
              this.showErrorMessage = true;
              this.showSuccessMessage = false;
            }
          }
        });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.signupForm.reset({role: 'client'});
  }
}