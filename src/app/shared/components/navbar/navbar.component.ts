import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NotificationsComponent } from './notification.component';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NotificationsComponent, CommonModule],
  template: `
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb">
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Show these buttons only when user is NOT logged in -->
            <ng-container *ngIf="!(isLoggedIn$ | async)">
              <button (click)="navigateToLogin()" 
                      class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Login
              </button>
              <button (click)="navigateToSignup()" 
                      class="bg-airbnb text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90">
                Sign up
              </button>
            </ng-container>

            <!-- Show these elements only when user is logged in -->
            <ng-container *ngIf="isLoggedIn$ | async">
              <a routerLink="/dashboard"
                 class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </a>
              
              <app-notifications></app-notifications>

              <div class="relative">
                <div class="flex items-center space-x-3">
                  <img class="h-8 w-8 rounded-full" 
                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                       alt="User profile">
                  <button (click)="logout()" 
                          class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      --airbnb: #FF385C;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

 
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // User will still be logged out locally even if the API call fails
      }
    });
  }
}