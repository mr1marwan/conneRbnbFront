import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { CreatePostComponent } from '../shared/components/create-post/create-post.component';
import { PropertyCardComponent } from '../shared/components/property-card/property-card.component';

interface Property {
  id: number;
  address: string;
  city: string;
  title: string;
  description: string;
  pricePerNight: number;
  images: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CreatePostComponent, PropertyCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>

      <!-- Hero Section with Parallax Effect -->
      <div class="relative bg-gradient-to-r from-blue-500 to-purple-600 pt-20 pb-24 px-4 sm:px-6 lg:pt-32 lg:pb-32 lg:px-8 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6')] bg-cover bg-center opacity-10"></div>
        </div>
        <div class="relative max-w-7xl mx-auto">
          <div class="text-center">
            <div class="flex justify-between items-center mb-8">
              <h3 class="text-2xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl animate-slide-in">
                Find your dream stay
              </h3>
              <button (click)="showCreatePost = true" 
                      class="transform hover:scale-105 transition-transform duration-200 inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Create New Listing
              </button>
            </div>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-white text-opacity-90 sm:mt-4 animate-slide-in" style="animation-delay: 0.2s">
              Discover unique places to stay and unforgettable experiences
            </p>
          </div>
          
          <!-- Enhanced Search Bar -->
          <div class="mt-12 max-w-3xl mx-auto animate-slide-in" style="animation-delay: 0.4s">
            <div class="flex items-center justify-center">
              <div class="flex-1 min-w-0 relative">
                <input type="text" 
                       class="block w-full px-6 py-4 rounded-l-xl border-0 shadow-lg focus:ring-2 focus:ring-white text-lg" 
                       placeholder="Where would you like to go?">
                <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </span>
              </div>
              <button class="px-8 py-4 border border-transparent text-lg font-medium rounded-r-xl text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg transform hover:scale-105 transition-all duration-200">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Property Listings Section -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Properties</h2>
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="rounded-xl overflow-hidden shadow-lg">
            <div class="skeleton h-48 w-full"></div>
            <div class="p-4">
              <div class="skeleton h-4 w-3/4 mb-2"></div>
              <div class="skeleton h-4 w-1/2 mb-4"></div>
              <div class="skeleton h-4 w-full"></div>
            </div>
          </div>
        </div>

        <!-- Properties Grid -->
        <div *ngIf="!isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <app-property-card 
            *ngFor="let property of properties; let i = index" 
            [property]="property"
            class="animate-slide-in"
            [style.animation-delay]="i * 0.1 + 's'">
          </app-property-card>
        </div>

        <!-- No Results State -->
        <div *ngIf="!isLoading && properties.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new property listing.</p>
        </div>
      </div>

      <!-- Create Post Popup -->
      <app-create-post *ngIf="showCreatePost" 
                      (close)="showCreatePost = false"
                      (submit)="onCreatePost($event)">
      </app-create-post>
    </div>
  `
})
export class HomeComponent implements OnInit {
  showCreatePost = false;
  properties: Property[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    this.isLoading = true;
    this.http.get<Property[]>('http://localhost:8080/api/properties')
      .subscribe({
        next: (data) => {
          this.properties = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching properties:', error);
          this.isLoading = false;
        }
      });
  }

  onCreatePost(data: any) {
    console.log('New post data:', data);
    this.showCreatePost = false;
    this.fetchProperties();
  }
}