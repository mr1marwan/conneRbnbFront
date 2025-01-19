import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PropertyCardComponent } from './property-card.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PropertyCardComponent, ConfirmDialogComponent],
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900">My Properties</h1>
          <button 
            routerLink="/properties/new"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-airbnb hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Property
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let i of [1,2,3]" class="bg-white rounded-lg shadow animate-pulse">
            <div class="h-48 bg-gray-200 rounded-t-lg"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Properties Grid -->
        <div *ngIf="!isLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <app-property-card
            *ngFor="let property of properties"
            [property]="property"
            (edit)="onEdit($event)"
            (delete)="onDelete($event)"
            (viewReservations)="onViewReservations($event)">
          </app-property-card>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && properties.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No properties</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating a new property listing.</p>
          <div class="mt-6">
            <button
              routerLink="/properties/new"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-airbnb hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Property
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <app-confirm-dialog
        *ngIf="showDeleteDialog"
        [title]="'Delete Property'"
        [message]="'Are you sure you want to delete this property? This action cannot be undone.'"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()">
      </app-confirm-dialog>
    </div>
  `,
  styles: [`
    :host {
      --airbnb: #FF385C;
      --airbnb-dark: #E31C5F;
    }
  `]
})
export class DashboardComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;
  showDeleteDialog = false;
  propertyToDelete: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProperties();
  }

  fetchProperties() {
    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.get<Property[]>('http://localhost:8080/api/properties', { headers })
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

  onEdit(propertyId: number) {
    // Navigate to edit page
    window.location.href = `/properties/${propertyId}/edit`;
  }

  onDelete(propertyId: number) {
    this.propertyToDelete = propertyId;
    this.showDeleteDialog = true;
  }

  onViewReservations(propertyId: number) {
    // Navigate to reservations page
    window.location.href = `/properties/${propertyId}/reservations`;
  }

  confirmDelete() {
    if (!this.propertyToDelete) return;

    const authToken = localStorage.getItem('access_token');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    this.http.delete(`http://localhost:8080/api/properties/${this.propertyToDelete}`, { headers })
      .subscribe({
        next: () => {
          this.properties = this.properties.filter(p => p.id !== this.propertyToDelete);
          this.showDeleteDialog = false;
          this.propertyToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting property:', error);
        }
      });
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.propertyToDelete = null;
  }
}