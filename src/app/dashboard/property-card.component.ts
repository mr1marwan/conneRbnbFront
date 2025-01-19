import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  pricePerNight: number;
  images: string[];
  reservationCount: number;
}

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Property Image -->
      <div class="relative h-48">
        <img 
          [src]="property.images[0] || 'https://via.placeholder.com/400x300'"
          alt="Property"
          class="w-full h-full object-cover"
        >
        <div class="absolute top-2 right-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {{property.reservationCount}} Reservations
          </span>
        </div>
      </div>

      <!-- Property Details -->
      <div class="p-4">
        <h3 class="text-lg font-medium text-gray-900 mb-1">{{property.title}}</h3>
        <p class="text-sm text-gray-500 mb-2">{{property.address}}, {{property.city}}</p>
        <p class="text-lg font-semibold text-airbnb">\${{property.pricePerNight}} / night</p>
        
        <!-- Action Buttons -->
        <div class="mt-4 flex justify-between">
          <button
            (click)="edit.emit(property.id)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
            <svg class="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          
          <button
            (click)="viewReservations.emit(property.id)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
            <svg class="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Reservations
          </button>
          
          <button
            (click)="delete.emit(property.id)"
            class="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <svg class="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --airbnb: #FF385C;
      --airbnb-dark: #E31C5F;
    }
  `]
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewReservations = new EventEmitter<number>();
}