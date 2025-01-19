import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Create New Listing</h2>
          <button (click)="onClose()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" formControlName="title" 
                   class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea formControlName="description" rows="3" 
                      class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" formControlName="address" 
                     class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input type="text" formControlName="city" 
                     class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Bedrooms</label>
              <input type="number" formControlName="bedrooms" 
                     class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Price per night</label>
              <input type="number" formControlName="pricePerNight" 
                     class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
            </div>
          </div>

          <div formArrayName="imageUrls">
            <label class="block text-sm font-medium text-gray-700">Image URLs (max 5)</label>
            <div *ngFor="let url of imageUrls.controls; let i=index" class="mt-2">
              <div class="flex gap-2">
                <input [formControlName]="i" type="url" 
                       class="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-airbnb focus:ring-airbnb">
                <button type="button" (click)="removeImageUrl(i)" 
                        class="text-red-500 hover:text-red-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <button type="button" (click)="addImageUrl()" 
                    *ngIf="imageUrls.length < 5"
                    class="mt-2 text-sm text-airbnb hover:text-airbnb-dark">
              + Add Image URL
            </button>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <button type="button" (click)="onClose()" 
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" 
                    [disabled]="!postForm.valid || isSubmitting"
                    class="px-4 py-2 text-sm font-medium text-white bg-airbnb border border-transparent rounded-md hover:bg-airbnb-dark disabled:opacity-50">
              {{ isSubmitting ? 'Creating...' : 'Create Listing' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CreatePostComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();
  @Input() hostId!: number;
  
  postForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      bedrooms: ['', [Validators.required, Validators.min(1)]],
      pricePerNight: ['', [Validators.required, Validators.min(0)]],
      imageUrls: this.fb.array([], Validators.maxLength(5))
    });
  }

  get imageUrls() {
    return this.postForm.get('imageUrls') as FormArray;
  }

  addImageUrl() {
    if (this.imageUrls.length < 5) {
      this.imageUrls.push(this.fb.control('', Validators.required));
    }
  }

  removeImageUrl(index: number) {
    this.imageUrls.removeAt(index);
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.postForm.valid && !this.isSubmitting) {
        this.isSubmitting = true;

        const authToken = localStorage.getItem('access_token');
        const userId = localStorage.getItem('user_id');
        
        if (!authToken || !userId) {
            console.error('No auth token or user ID found');
            return;
        }

        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${authToken}`);

        const propertyData = {
            hostId: 1, // Convert the stored userId to number and use it as hostId
            title: this.postForm.value.title,
            description: this.postForm.value.description,
            address: this.postForm.value.address,
            city: this.postForm.value.city,
            bedrooms: this.postForm.value.bedrooms,
            pricePerNight: this.postForm.value.pricePerNight,
            images: this.postForm.value.imageUrls || [] // Ensure images is always an array
        };
        
        console.log('Sending property data:', propertyData);
        console.log('With headers:', headers);

        this.http.post('http://localhost:8080/api/properties', propertyData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Property created successfully:', response);
                    this.submit.emit(response);
                    this.onClose();
                },
                error: (error) => {
                    console.error('Error creating property:', error);
                    if (error.error instanceof Error) {
                        console.error('Parsing error:', error.error);
                    }
                    this.isSubmitting = false;
                },
                complete: () => {
                    this.isSubmitting = false;
                }
            });
    }
}
}