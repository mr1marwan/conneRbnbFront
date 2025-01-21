import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Property {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  pricePerNight: number;
  images: string[];
}

@Component({
  selector: 'app-edit-property-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                  Edit Property
                </h3>
                <div class="mt-2 space-y-4">
                  <!-- Title -->
                  <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      [(ngModel)]="editedProperty.title"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb sm:text-sm"
                    >
                  </div>

                  <!-- Description -->
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      [(ngModel)]="editedProperty.description"
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb sm:text-sm"
                    ></textarea>
                  </div>

                  <!-- Address -->
                  <div>
                    <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      [(ngModel)]="editedProperty.address"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb sm:text-sm"
                    >
                  </div>

                  <!-- City -->
                  <div>
                    <label for="city" class="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      id="city"
                      [(ngModel)]="editedProperty.city"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb sm:text-sm"
                    >
                  </div>

                  <!-- Price per Night -->
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700">Price per Night</label>
                    <div class="mt-1 relative rounded-md shadow-sm">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="price"
                        [(ngModel)]="editedProperty.pricePerNight"
                        class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb sm:text-sm"
                      >
                    </div>
                  </div>

                  <!-- Images -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Images</label>
                    <div class="mt-1 flex flex-wrap gap-2">
                      <div *ngFor="let image of editedProperty.images; let i = index" class="relative">
                        <img [src]="image" alt="Property" class="h-20 w-20 object-cover rounded">
                        <button
                          (click)="removeImage(i)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        (click)="addImage()"
                        class="h-20 w-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-airbnb focus:outline-none">
                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              (click)="saveChanges()"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-airbnb text-base font-medium text-white hover:bg-airbnb-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb sm:ml-3 sm:w-auto sm:text-sm">
              Save Changes
            </button>
            <button 
              (click)="cancel.emit()"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airbnb sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
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
export class EditPropertyDialogComponent {
    @Input() property!: Property;
    @Output() saveEvent = new EventEmitter<Property>();
    @Output() cancel = new EventEmitter<void>();
  
    editedProperty: Property = {
      id: 0,
      title: '',
      description: '',
      address: '',
      city: '',
      pricePerNight: 0,
      images: []
    };
  
    constructor(private http: HttpClient) {}
  
    ngOnInit() {
      // Create a copy of the property to edit
      this.editedProperty = { ...this.property };
    }
  
    addImage() {
      const imageUrl = prompt('Enter image URL:');
      if (imageUrl) {
        this.editedProperty.images = [...this.editedProperty.images, imageUrl];
      }
    }
  
    removeImage(index: number) {
      this.editedProperty.images = this.editedProperty.images.filter((_, i) => i !== index);
    }
  
    saveChanges() {
        const authToken = localStorage.getItem('access_token');
        if (!authToken) {
          console.error('No auth token found');
          return;
        }
      
        const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
      
        this.http.put<Property>(
          `http://localhost:8080/api/properties/${this.editedProperty.id}`,
          this.editedProperty,
          { headers }
        ).subscribe({
          next: (updatedProperty) => {
            console.log('Property updated successfully:', updatedProperty);
      
            // Emit the updated property
            this.saveEvent.emit(updatedProperty);
      
            // Close the dialog and refresh the page
            this.cancel.emit(); // Close the popup
            window.location.reload(); // Refresh the page
          },
          error: (error) => {
            console.error('Error updating property:', error);
          }
        });
      }
      
  }