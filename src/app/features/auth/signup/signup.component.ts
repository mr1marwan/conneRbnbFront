import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
                <input id="name" formControlName="name" type="text" class="input-field">
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input id="email" formControlName="email" type="email" class="input-field">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input id="password" formControlName="password" type="password" class="input-field">
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-1">
                <input id="phone" formControlName="phone" type="tel" class="input-field">
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
              <button type="submit" class="w-full btn-primary">Sign up</button>
            </div>
          </form>

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

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', [Validators.required]],
      role: ['client', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
    }
  }
}