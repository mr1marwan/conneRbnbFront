import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { CreatePostComponent } from '../shared/components/create-post/create-post.component';

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
  imports: [CommonModule, NavbarComponent, CreatePostComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-navbar></app-navbar>

      <!-- Hero Section -->
      <div class="relative bg-gray-50 pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div class="relative max-w-7xl mx-auto">
          <div class="text-center">
            <div class="flex justify-between items-center mb-8">
              <h1 class="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                Find your next stay
              </h1>
              <button (click)="showCreatePost = true" 
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-airbnb hover:bg-airbnb-dark">
                Create New Listing
              </button>
            </div>
            <p class="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Search low prices on hotels, homes and much more...
            </p>
          </div>
          
          <!-- Search Bar -->
          <div class="mt-8 max-w-3xl mx-auto">
            <div class="flex items-center justify-center">
              <div class="flex-1 min-w-0">
                <input type="text" 
                       class="block w-full px-4 py-3 rounded-l-lg border-gray-300 shadow-sm focus:ring-airbnb focus:border-airbnb" 
                       placeholder="Where are you going?">
              </div>
              <button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg text-white bg-airbnb hover:bg-airbnb-dark">
                Search
              </button>
            </div>
          </div>

          <!-- Property Listings -->
          <div class="mt-12 max-w-7xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div *ngFor="let property of properties" 
                 class="flex flex-col rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
              <!-- Image Carousel -->
              <div class="relative h-48 w-full">
                <div class="absolute inset-0 flex">
                  <img *ngFor="let image of property.images; let i = index"
                       [src]="image"
                       [class.hidden]="currentImageIndex[property.id] !== i"
                       class="h-full w-full object-cover"
                       alt="Property image">
                </div>
                <!-- Navigation Arrows -->
                <div class="absolute inset-0 flex items-center justify-between p-2" *ngIf="property.images.length > 1">
                  <button (click)="previousImage(property.id)" 
                          class="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100">
                    ←
                  </button>
                  <button (click)="nextImage(property.id)" 
                          class="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100">
                    →
                  </button>
                </div>
                <!-- Image Counter -->
                <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                  {{currentImageIndex[property.id] + 1}}/{{property.images.length}}
                </div>
              </div>
              
              <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{property.title}}</h3>
                <p class="text-sm text-gray-500 mb-2">{{property.city}}</p>
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{property.description}}</p>
                <p class="text-lg font-semibold text-gray-900">{{property.pricePerNight}} / night</p>
              </div>
            </div>
          </div>
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
  currentImageIndex: { [key: number]: number } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    this.http.get<Property[]>('http://localhost:8080/api/properties')
      .subscribe({
        next: (data) => {
          console.log('Received properties:', data); // Add this line
          this.properties = data;
          // Initialize image indices for each property
          this.properties.forEach(property => {
            this.currentImageIndex[property.id] = 0;
          });
        },
        error: (error) => {
          console.error('Error fetching properties:', error);
        }
      });
  }

  nextImage(propertyId: number) {
    const property = this.properties.find(p => p.id === propertyId);
    if (property) {
      this.currentImageIndex[propertyId] = 
        (this.currentImageIndex[propertyId] + 1) % property.images.length;
    }
  }

  previousImage(propertyId: number) {
    const property = this.properties.find(p => p.id === propertyId);
    if (property) {
      this.currentImageIndex[propertyId] = 
        (this.currentImageIndex[propertyId] - 1 + property.images.length) % property.images.length;
    }
  }

  onCreatePost(data: any) {
    console.log('New post data:', data);
    this.showCreatePost = false;
    // Refresh the properties list after creating a new post
    this.fetchProperties();
  }
}