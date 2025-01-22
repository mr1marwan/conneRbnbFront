import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  pricePerNight: number;
  bedrooms: number;
  averageRating?: number;
}

interface Review {
  id: number;
  propertyId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <aside class="fixed inset-y-0 left-0 w-64 bg-airbnb text-white transition-transform duration-300 transform"
             [class.translate-x-0]="showSidebar"
             [class.-translate-x-full]="!showSidebar">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Admin Panel</h2>
            <button class="lg:hidden" (click)="toggleSidebar()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav class="mt-8 space-y-2">
            <button (click)="setActiveTab('dashboard')"
                    class="w-full px-4 py-3 rounded-lg transition-colors duration-200"
                    [class.bg-gray-800]="activeTab === 'dashboard'">
              <div class="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Dashboard</span>
              </div>
            </button>
            <button (click)="setActiveTab('users')"
                    class="w-full px-4 py-3 rounded-lg transition-colors duration-200"
                    [class.bg-gray-800]="activeTab === 'users'">
              <div class="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Users</span>
              </div>
            </button>
            <button (click)="setActiveTab('properties')"
                    class="w-full px-4 py-3 rounded-lg transition-colors duration-200"
                    [class.bg-gray-800]="activeTab === 'properties'">
              <div class="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Properties</span>
              </div>
            </button>
            <button (click)="setActiveTab('reviews')"
                    class="w-full px-4 py-3 rounded-lg transition-colors duration-200"
                    [class.bg-gray-800]="activeTab === 'reviews'">
              <div class="flex items-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>Reviews</span>
              </div>
            </button>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="lg:ml-64">
        <!-- Top Bar -->
        <header class="bg-white shadow-sm">
          <div class="flex items-center justify-between px-6 py-4">
            <button class="lg:hidden" (click)="toggleSidebar()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <input type="text"
                       placeholder="Search..."
                       class="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button class="relative p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <!-- Dashboard Content -->
        <main class="p-6">
          <!-- Dashboard Overview -->
          <div *ngIf="activeTab === 'dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Users</p>
                  <p class="text-2xl font-semibold mt-2">{{users.length}}</p>
                </div>
                <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Properties</p>
                  <p class="text-2xl font-semibold mt-2">{{properties.length}}</p>
                </div>
                <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p class="text-2xl font-semibold mt-2">{{getTotalReviews()}}</p>
                </div>
                <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Average Rating</p>
                  <p class="text-2xl font-semibold mt-2">{{getAverageRating().toFixed(1)}}</p>
                </div>
                <div class="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Users Table -->
          <div *ngIf="activeTab === 'users'" class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Users</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let user of users">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span class="text-sm font-medium text-gray-600">{{user.name[0]}}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{user.name}}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{user.email}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            [class.bg-green-100]="user.role === 'admin'"
                            [class.text-green-800]="user.role === 'admin'"
                            [class.bg-blue-100]="user.role === 'user'"
                            [class.text-blue-800]="user.role === 'user'">
                        {{user.role}}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{user.createdAt | date}}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button (click)="deleteUser(user.id)" 
                              class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Properties Table -->
          <div *ngIf="activeTab === 'properties'" class="bg-white rounded-xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">Properties</h2>
            </div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let property of properties">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">{{property.title}}</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{property.city}}</div>
                      <div class="text-sm text-gray-500">{{property.address}}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{property.pricePerNight}} dh/night</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span class="text-sm text-gray-900 mr-2">{{property.averageRating?.toFixed(1) || 'N/A'}}</span>
                        <div class="flex">
                          <ng-container *ngFor="let star of [1,2,3,4,5]">
                            <svg [class.text-yellow-400]="star <= (property.averageRating || 0)"
                                 [class.text-gray-300]="star > (property.averageRating || 0)"
                                 class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </ng-container>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button (click)="viewPropertyReviews(property.id)" 
                              class="text-blue-600 hover:text-blue-900 mr-4">Reviews</button>
                      <button (click)="deleteProperty(property.id)" 
                              class="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reviews Section -->
          <div *ngIf="activeTab === 'reviews'" class="space-y-6">
            <div *ngFor="let property of properties" class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">{{property.title}}</h3>
                <p class="text-sm text-gray-500">{{property.city}}, {{property.address}}</p>
              </div>
              <div class="p-6">
                <div *ngFor="let review of getPropertyReviews(property.id)" class="mb-6 last:mb-0">
                  <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-4">
                      <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span class="text-sm font-medium text-gray-600">{{review.userName[0]}}</span>
                      </div>
                      <div>
                        <div class="flex items-center">
                          <p class="font-medium text-gray-900">{{review.userName}}</p>
                          <span class="mx-2 text-gray-300">•</span>
                          <p class="text-sm text-gray-500">{{review.createdAt | date}}</p>
                        </div>
                        <div class="flex mt-1">
                          <ng-container *ngFor="let star of [1,2,3,4,5]">
                            <svg [class.text-yellow-400]="star <= review.rating"
                                 [class.text-gray-300]="star > review.rating"
                                 class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </ng-container>
                        </div>
                        <p class="mt-2 text-gray-700">{{review.comment}}</p>
                      </div>
                    </div>
                    <button (click)="deleteReview(review.id)" 
                            class="text-red-600 hover:text-red-900">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  properties: Property[] = [];
  reviews: { [propertyId: number]: Review[] } = {};
  activeTab = 'dashboard';
  showSidebar = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
    this.fetchProperties();
  }

  fetchUsers() {
    this.http.get<User[]>('http://localhost:8080/api/admin/users')
      .subscribe({
        next: (data) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        }
      });
  }

  fetchProperties() {
    this.http.get<Property[]>('http://localhost:8080/api/admin/properties')
      .subscribe({
        next: (data) => {
          this.properties = data;
          this.properties.forEach(property => {
            this.fetchPropertyReviews(property.id);
          });
        },
        error: (error) => {
          console.error('Error fetching properties:', error);
        }
      });
  }

  fetchPropertyReviews(propertyId: number) {
    this.http.get<Review[]>(`http://localhost:8080/api/admin/properties/${propertyId}/reviews`)
      .subscribe({
        next: (data) => {
          this.reviews[propertyId] = data;
        },
        error: (error) => {
          console.error(`Error fetching reviews for property ${propertyId}:`, error);
        }
      });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8080/api/admin/users/${userId}`)
        .subscribe({
          next: () => {
            this.users = this.users.filter(user => user.id !== userId);
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
    } }

  deleteProperty(propertyId: number) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.http.delete(`http://localhost:8080/api/admin/properties/${propertyId}`)
        .subscribe({
          next: () => {
            this.properties = this.properties.filter(property => property.id !== propertyId);
            delete this.reviews[propertyId];
          },
          error: (error) => {
            console.error('Error deleting property:', error);
          }
        });
    }
  }

  deleteReview(reviewId: number) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.http.delete(`http://localhost:8080/api/admin/reviews/${reviewId}`)
        .subscribe({
          next: () => {
            // Update reviews in all properties
            Object.keys(this.reviews).forEach(propertyId => {
              this.reviews[Number(propertyId)] = this.reviews[Number(propertyId)]
                .filter(review => review.id !== reviewId);
            });
          },
          error: (error) => {
            console.error('Error deleting review:', error);
          }
        });
    }
  }

  getPropertyReviews(propertyId: number): Review[] {
    return this.reviews[propertyId] || [];
  }

  getTotalReviews(): number {
    return Object.values(this.reviews)
      .reduce((total, propertyReviews) => total + propertyReviews.length, 0);
  }

  getAverageRating(): number {
    const allReviews = Object.values(this.reviews).flat();
    if (allReviews.length === 0) return 0;
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / allReviews.length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  viewPropertyReviews(propertyId: number) {
    this.activeTab = 'reviews';
    // Scroll to the property's reviews section
    setTimeout(() => {
      const propertyElement = document.querySelector(`[data-property-id="${propertyId}"]`);
      if (propertyElement) {
        propertyElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
}

bootstrapApplication(AdminDashboardComponent);