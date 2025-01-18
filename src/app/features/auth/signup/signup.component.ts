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
              <label for="firstname" class="block text-sm font-medium text-gray-700">First Name</label>
              <div class="mt-1">
                <input id="firstname" formControlName="firstname" type="text" class="input-field" [ngClass]="{'border-red-500': signupForm.get('firstname')?.invalid && signupForm.get('firstname')?.touched}">
                <p *ngIf="signupForm.get('firstname')?.invalid && signupForm.get('firstname')?.touched" class="mt-2 text-sm text-red-600">First name is required</p>
              </div>
            </div>

            <div>
              <label for="lastname" class="block text-sm font-medium text-gray-700">Last Name</label>
              <div class="mt-1">
                <input id="lastname" formControlName="lastname" type="text" class="input-field" [ngClass]="{'border-red-500': signupForm.get('lastname')?.invalid && signupForm.get('lastname')?.touched}">
                <p *ngIf="signupForm.get('lastname')?.invalid && signupForm.get('lastname')?.touched" class="mt-2 text-sm text-red-600">Last name is required</p>
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
              <label class="block text-sm font-medium text-gray-700">Role</label>
              <div class="mt-2">
                <div class="flex items-center space-x-4">
                  <label class="flex items-center">
                    <input type="radio" formControlName="role" value="ROLE_CLIENT" class="h-4 w-4 text-airbnb">
                    <span class="ml-2">Client</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" formControlName="role" value="ROLE_HOST" class="h-4 w-4 text-airbnb">
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
  successMessage = 'registered successfully';
  errorMessage = 'an error occured while signing up';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['ROLE_CLIENT', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
  
      // Ensure the role is one of the expected values
      if (
        formData.role !== 'ROLE_ADMIN' &&
        formData.role !== 'ROLE_HOST' &&
        formData.role !== 'ROLE_CLIENT'
      ) {
        formData.role = 'ROLE_CLIENT'; // Default to client if somehow an invalid role is selected
      }
  
      // Include headers in the request
      const headers = {
        'Content-Type': 'application/json',
      };
      this.http
        .post('http://localhost:8080/api/v1/auth/register', formData, {
          headers, // Add headers here
          responseType: 'text',
          withCredentials: true, // Optional: Include credentials if needed
        })
        .subscribe({
          next: (response: string) => {
            console.log('User registered');
            this.successMessage = 'User registered successfully!';
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
              this.successMessage =
                'User registered successfully!';
              this.showSuccessMessage = true;
              this.showErrorMessage = false;
              this.resetForm();
              setTimeout(() => {
                this.showSuccessMessage = false;
              }, 3000);
            } else {
              this.errorMessage =
                error.error ||
                'An error occurred during registration. Please try again.';
              this.showErrorMessage = true;
              this.showSuccessMessage = false;
            }
          },
        });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
  

  resetForm() {
    this.signupForm.reset({role: 'ROLE_CLIENT'});
  }
}