import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Property {
  id: number;
  address: string;
  city: string;
  title: string;
  description: string;
  bedrooms: number;
  pricePerNight: number;
  images: string[];
}

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex flex-col rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      <!-- Image Carousel -->
      <div class="relative h-48 w-full">
        <div class="absolute inset-0 flex">
          <img *ngFor="let image of property.images; let i = index"
               [src]="image"
               [class.hidden]="currentImageIndex !== i"
               class="h-full w-full object-cover"
               [alt]="'Image ' + (i + 1) + ' of ' + property.title">
        </div>
        <!-- Navigation Arrows -->
        <div class="absolute inset-0 flex items-center justify-between p-2" *ngIf="property.images.length > 1">
          <button (click)="previousImage()" 
                  class="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                  aria-label="Previous image">
            ←
          </button>
          <button (click)="nextImage()" 
                  class="p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                  aria-label="Next image">
            →
          </button>
        </div>
        <!-- Image Counter -->
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
          {{currentImageIndex + 1}}/{{property.images.length}}
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{property.title}}</h3>
        <p class="text-sm text-gray-500 mb-2">{{property.city}}</p>
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{property.description}}</p>
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{property.bedrooms}} rooms</p>
        <p class="text-lg font-semibold text-gray-900 mb-3">{{property.pricePerNight}} dh per night</p>
        <a [routerLink]="['/property', property.id]" 
           class="inline-block bg-airbnb text-white font-semibold py-2 px-4 rounded hover:bg-airbnb-dark transition-colors duration-300">
          See Details
        </a>
      </div>
    </div>
  `
})
export class PropertyCardComponent {
  @Input() property!: Property;
  currentImageIndex: number = 0;

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.property.images.length;
  }

  previousImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.property.images.length) % this.property.images.length;
  }
}